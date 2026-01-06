// API client for frontend communication with backend server

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiCall(endpoint: string, method: string = 'GET', data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Auth API functions
export async function signUp(email: string, password: string, fullName: string, userType: string = 'student') {
  try {
    const response = await apiCall('/api/auth/signup', 'POST', { email, password, fullName, userType });
    console.log('Signup response:', response);
    // Extract user from response (backend returns { user: {...} })
    const userData = response.user || response;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { user: userData, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await apiCall('/api/auth/signin', 'POST', { email, password });
    console.log('Signin response:', response);
    // Extract user from response (backend returns { user: {...} })
    const userData = response.user || response;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { user: userData, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function signOut() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Profile API functions
export async function getProfiles() {
  return apiCall('/api/profiles');
}

export async function updateProfile(id: string, data: any) {
  return apiCall(`/api/profiles/${id}`, 'PUT', data);
}

export async function deleteProfile(id: string) {
  return apiCall(`/api/profiles/${id}`, 'DELETE');
}

// News API functions
export async function getNews() {
  return apiCall('/api/news');
}

export async function createNews(data: any) {
  return apiCall('/api/news', 'POST', data);
}

export async function updateNews(id: string, data: any) {
  return apiCall(`/api/news/${id}`, 'PUT', data);
}

export async function deleteNews(id: string) {
  return apiCall(`/api/news/${id}`, 'DELETE');
}

// Jobs API functions
export async function getJobs() {
  return apiCall('/api/jobs');
}

export async function createJob(data: any) {
  return apiCall('/api/jobs', 'POST', data);
}

export async function updateJob(id: string, data: any) {
  return apiCall(`/api/jobs/${id}`, 'PUT', data);
}

export async function deleteJob(id: string) {
  return apiCall(`/api/jobs/${id}`, 'DELETE');
}

// Merchandise API functions
export async function getMerchandise() {
  return apiCall('/api/merchandise');
}

export async function createMerchandise(data: any) {
  return apiCall('/api/merchandise', 'POST', data);
}

export async function updateMerchandise(id: string, data: any) {
  return apiCall(`/api/merchandise/${id}`, 'PUT', data);
}

export async function deleteMerchandise(id: string) {
  return apiCall(`/api/merchandise/${id}`, 'DELETE');
}

// Achievements API functions
export async function getAchievements() {
  return apiCall('/api/achievements');
}

export async function createAchievement(data: any) {
  return apiCall('/api/achievements', 'POST', data);
}

export async function updateAchievement(id: string, data: any) {
  return apiCall(`/api/achievements/${id}`, 'PUT', data);
}

export async function deleteAchievement(id: string) {
  return apiCall(`/api/achievements/${id}`, 'DELETE');
}
