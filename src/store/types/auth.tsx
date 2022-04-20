export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
};

export interface AuthState {
  isAuthenticated: boolean;
  user: UserType;
  token: string | null;
  refreshToken: string | null;
  idToken: string | null;
}
