import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TODO_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function hasConfiguredApi() {
  return Boolean(process.env.NEXT_PUBLIC_TODO_API_URL);
}
