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
  const newOptions: any = {
    ...options,
    baseURL: config.public.baseURL,
    headers: {
      'x-api-key': config.public.apiKey,
      Accept: 'application/json',
    },
  };
  return useFetch(request, newOptions);
};

class ApiService {
  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: RequestConfig
   * @returns Promise<FetchResponse>
   */
  public static query(resource: string, params: any) {
    return useMyFetch({ request: resource, options: params });
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<FetchResponse>
   */
  public static get(resource: string, slug = '' as string) {
    return useMyFetch({ request: `${resource}/${slug}` });
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: RequestConfig
   * @returns Promise<FetchResponse>
   */
  public static post(resource: string, params: any, extraHeaders?: { [key: string]: any }) {
    return useMyFetch({
      request: resource,
      options: {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(extraHeaders || {}),
        },
      },
    });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: RequestConfig
   * @returns Promise<FetchResponse>
   */
  public static update(resource: string, slug: string, params: any) {
    return useMyFetch({
      request: `${resource}/${slug}`,
      options: {
        method: 'PUT',
        body: params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    });
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: RequestConfig
   * @returns Promise<FetchResponse>
   */
  public static put(resource: string, params: any) {
    return useMyFetch({
      request: resource,
      options: {
        method: 'PUT',
        body: params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    });
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<FetchResponse>
   */
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
