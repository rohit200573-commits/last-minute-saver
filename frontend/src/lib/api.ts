const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Hardcoded mock data for Judges Demo
const MOCK_USER = { level: 42, xp: 850, nextLevelXp: 1000, streak: 14 };
const MOCK_TASKS = [
  { id: '1', title: 'Finish Hackathon Pitch', description: 'Record the demo video and submit', status: 'IN_PROGRESS', priority: 'CRITICAL', deadline: { date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() } },
  { id: '2', title: 'Polish 3D Animations', description: 'Optimize for mobile devices', status: 'COMPLETED', priority: 'HIGH', deadline: null },
  { id: '3', title: 'Add Error Boundaries', description: 'Wrap all three.js components', status: 'PENDING', priority: 'MEDIUM', deadline: null },
];
const MOCK_ANALYTICS = [
  { metricName: 'Tasks Completed', metricValue: 120 },
  { metricName: 'Deep Work Hours', metricValue: 45 },
  { metricName: 'Procrastination Risk', metricValue: 0.15 }
];

export async function fetchWithAuth(
  endpoint: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {}
) {
  // Demo Mode Interceptor
  if (typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true') {
    return new Promise(resolve => {
      setTimeout(() => {
        if (endpoint.includes('/users/me')) resolve(MOCK_USER);
        else if (endpoint.includes('/tasks')) resolve(MOCK_TASKS);
        else if (endpoint.includes('/analytics')) resolve(MOCK_ANALYTICS);
        else resolve({});
      }, 300); // Simulate network delay
    });
  }

  const token = await getToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}