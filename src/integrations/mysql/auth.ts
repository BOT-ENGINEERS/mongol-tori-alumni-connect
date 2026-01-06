import { query, execute } from '@/integrations/mysql/client';

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user?: User;
  error?: string;
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  // For development only - use bcrypt in production
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

export async function signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
  try {
    // Check if user already exists
    const existing = await query<any>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return { error: 'User already exists' };
    }

    const userId = generateUUID();
    const passwordHash = hashPassword(password);

    // Create user
    await execute(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [userId, email, passwordHash]
    );

    // Create profile
    await execute(
      `INSERT INTO profiles (id, user_id, full_name, email, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [generateUUID(), userId, fullName, email]
    );

    return { user: { id: userId, email } };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Sign up failed' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const results = await query<any>(
      'SELECT id, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = results[0];

    if (!verifyPassword(password, user.password_hash)) {
      return { error: 'Invalid email or password' };
    }

    // Store user session in localStorage
    localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email }));

    return { user: { id: user.id, email } };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Sign in failed' };
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
