import axios from 'axios';
import { authApi } from '../auth';
import { baseUrl } from './base-url';

export async function json<T>(path: string): Promise<T> {
  try {
    const response = await axios.get(`${baseUrl}${path}`, { headers: { Authorization: authApi.getToken() } });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}

export async function post<T>(path: string, body: any): Promise<T> {
  try {
    const response = await axios.post(`${baseUrl}${path}`, body, { headers: { Authorization: authApi.getToken() } });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}

export async function put<T>(path: string, body: any): Promise<T> {
  try {
    const response = await axios.put(`${baseUrl}${path}`, body, { headers: { Authorization: authApi.getToken() } });
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message);
    }
    throw new Error(err.message);
  }
}
