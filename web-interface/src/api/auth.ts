import decode from 'jwt-decode';
import { json, post, put } from './common/http.service';
import { IUserProfile, ISettings } from '../model';

export const authApi = {
  login: async (userCredentials: { name: string; password: string }): Promise<{ token: string }> => {
    return post('/login', {
      username: userCredentials.name,
      password: userCredentials.password
    });
  },

  signup: async (userCredentials: { name: string; password: string }): Promise<{ token: string }> => {
    return post('/signup', {
      username: userCredentials.name,
      password: userCredentials.password
    });
  },

  fetchProfile: async (): Promise<IUserProfile> => {
    return json('/profile');
  },

  fetchSettings: async (): Promise<ISettings> => {
    return json('/settings');
  },

  fetchData: async <T>(name: string): Promise<T> => {
    return json(`/${name}`);
  },

  addData: async <T>(name: string, body: any): Promise<T> => {
    return post(`/${name}`, body);
  },

  updateData: async <T>(name: string, body: any): Promise<T> => {
    return put(`/${name}`, body);
  },

  loggedIn: () => {
    // Checks if there is a saved token and it's still valid
    const token = authApi.getToken(); // Getting token from localstorage
    return !!token && !authApi.isTokenExpired(token); // handwaiving here
  },

  deleteToken: () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem(tokenName);
  },

  setToken: (idToken: string) => {
    // Saves user token to localStorage
    localStorage.setItem(tokenName, idToken);
  },

  getToken: () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem(tokenName);
  },

  isTokenExpired: (token: string) => {
    // TODO: Разобраться как работать
    try {
      const decoded = decode<{ exp: number }>(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // console.log("expired check failed!");
      return false;
    }
  }
};
