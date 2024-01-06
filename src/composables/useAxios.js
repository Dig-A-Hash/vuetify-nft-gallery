import axios from 'axios';

export function useAxios() {
  return axios.create({
    baseURL: import.meta.env.VITE_POUR_HOUSE_API,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    },
  });
}
