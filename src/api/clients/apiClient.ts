import { request } from '@playwright/test';

export async function createApiClient() {
  return await request.newContext({
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: {
      'x-api-key': process.env.X_API_KEY || '',
    }
  });
}
