import { UserRole } from '../types';

/**
 * Checks whether a requested route is permitted for the given authenticated role.
 */
export function isRouteAllowedForRole(role: UserRole, route: string): boolean {
  if (!role || !route) return false;

  if (role === 'admin') {
    return route.startsWith('/admin');
  }

  if (role === 'faculty') {
    return route.startsWith('/faculty');
  }

  if (role === 'student') {
    return route.startsWith('/student');
  }

  return false;
}

/**
 * Returns the default dashboard route for an authenticated role.
 */
export function getDefaultDashboardForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/overview';
    case 'faculty':
      return '/faculty/overview';
    case 'student':
      return '/student/overview';
    default:
      return '/login';
  }
}
