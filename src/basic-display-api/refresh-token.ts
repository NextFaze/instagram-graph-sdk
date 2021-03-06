import fetch from 'node-fetch';
import { config } from '../config';

export interface refreshTokenProps {
  access_token: string;
}

/**
 * Refresh access long lived token
 */
export async function refreshToken({ access_token }: refreshTokenProps) {
  const params = new URLSearchParams({});
  params.append('grant_type', 'ig_refresh_token');
  params.append('access_token', access_token);
  const response = await fetch(
    `${config.basicDisplayApiBaseUrl}/refresh_access_token?${params}`,
    { method: 'GET' }
  );
  return await response.json();
}
