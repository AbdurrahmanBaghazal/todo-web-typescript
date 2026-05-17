import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TODO_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export function shouldUseLocalStorage() {
  return process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === "true";
}
