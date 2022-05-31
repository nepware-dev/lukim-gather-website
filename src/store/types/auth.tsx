export type UserType = {
  id: string,
  firstName: string;
  lastName: string;
  email: string;
  isStaff: boolean;
};

export interface AuthState {
  isAuthenticated: boolean;
  user: UserType;
  token: string | null;
  refreshToken: string | null;
  idToken: string | null;
}
