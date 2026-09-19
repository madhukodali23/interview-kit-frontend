import { apiGet, apiPost } from "./client";
import { User } from "./types";

export interface Credentials {
  email: string;
  password: string;
}

export const register = (credentials: Credentials) =>
  apiPost<User>("/api/auth/register", credentials);

export const login = (credentials: Credentials) =>
  apiPost<User>("/api/auth/login", credentials);

export const logout = () => apiPost<void>("/api/auth/logout");

export const getSession = () => apiGet<User>("/api/auth/session");
