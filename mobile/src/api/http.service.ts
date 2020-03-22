// import { authApi } from "./auth";
import { baseUrl } from '../helpers/utils';

export async function get<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}

export async function post<T, U>(path: string, body: string): Promise<T> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body,
    });
    return response.json();
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}

export async function put<T>(path: string, body: string): Promise<T> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body,
    });
    return response.json();
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}
