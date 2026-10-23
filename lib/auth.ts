import { DEMO_USERS, User, UserRole } from './seed';

export const AUTH_COOKIE_ROLE = 'cue_user_role';
export const AUTH_COOKIE_EMAIL = 'cue_user_email';
export const AUTH_COOKIE_NAME = 'cue_user_name';

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
  redirectTo?: string;
}

export function getDefaultRedirectForRole(role: UserRole): string {
  switch (role) {
    case 'staff':
      return '/staff';
    case 'owner':
      return '/owner';
    case 'customer':
    default:
      return '/';
  }
}

export function authenticateUser(email: string, password: string): LoginResult {
  const cleanEmail = email.trim().toLowerCase();
  
  // Find matching user from DEMO_USERS
  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: 'Invalid credentials. Please use one of the demo accounts below.',
    };
  }

  // Check demo passwords
  let isValidPass = false;
  if (user.role === 'customer' && password === 'Demo@123') isValidPass = true;
  if (user.role === 'staff' && password === 'Staff@123') isValidPass = true;
  if (user.role === 'owner' && password === 'Owner@123') isValidPass = true;

  if (!isValidPass) {
    return {
      success: false,
      error: 'Incorrect password for this demo account.',
    };
  }

  return {
    success: true,
    user,
    redirectTo: getDefaultRedirectForRole(user.role),
  };
}

export function getUserByEmail(email: string): User | undefined {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserByRole(role: UserRole): User | undefined {
  return DEMO_USERS.find((u) => u.role === role);
}
