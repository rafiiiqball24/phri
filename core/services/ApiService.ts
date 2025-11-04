import type { App } from 'vue';
import axios from 'axios';
import JwtService from '@/core/services/JwtService';

interface IFetch {
  request: string;
  options?: {
    [key: string]: any;
  };
}

const useMyFetch = ({ request, options }: IFetch) => {
  const config = useRuntimeConfig();
  const defaults: Record<string, any> = {
    'x-api-key': config.public.apiKey,
    Accept: 'application/json',
  };
  const mergedHeaders = { ...defaults, ...(options?.headers || {}) };
  const newOptions: any = { ...options, baseURL: config.public.baseURL, headers: mergedHeaders };
  return useFetch(request, newOptions);
};

class ApiService {
  
  public static query(resource: string, params: any) {
    return useMyFetch({ request: resource, options: params });
  }

 
  public static get(resource: string, slug = '' as string) {
    return useMyFetch({ request: `${resource}/${slug}` });
  }

 
  public static post(resource: string, params: any, extraHeaders?: { [key: string]: any }) {
    return useMyFetch({
      request: resource,
      options: {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/json',
          ...(extraHeaders || {}),
        },
      },
    });
  }


  public static update(resource: string, slug: string, params: any) {
    return useMyFetch({
      request: `${resource}/${slug}`,
      options: {
        method: 'PUT',
        body: params,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });
  }

 
  public static put(resource: string, params: any) {
    return useMyFetch({
      request: resource,
      options: {
        method: 'PUT',
        body: params,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });
  }

  
  public static delete(resource: string) {
    return useMyFetch({
      request: resource,
      options: {
        method: 'DELETE',
      },
    });
  }
}

export default ApiService;
