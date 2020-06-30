const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = '3649';
const PREFIX = 'api';
const URL = `${PROTOCOL}://${HOST}:${PORT}/${PREFIX}`;

export async function get<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${URL}${path}`, {
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

export async function post<T>(path: string, body: string): Promise<T> {
  try {
    const response = await fetch(`${URL}${path}`, {
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
    const response = await fetch(`${URL}${path}`, {
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

export async function remove<T>(path: string, body?: string): Promise<T> {
  try {
    const response = await fetch(`${URL}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body
    });
    return response.json();
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}
