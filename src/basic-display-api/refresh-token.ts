import fetch from 'node-fetch';
import { config } from '../config';

export interface refreshTokenProps {
  access_token: string;
}

/**
 * Refresh access long lived token
 * @requires permission: [instagram_graph_user_profile](https://developers.facebook.com/docs/instagram-basic-display-api/reference/refresh_access_token)
 */
export async function refreshToken({ access_token }: refreshTokenProps) {
  const params = new URLSearchParams({});
  params.append('grant_type', 'ig_refresh_token');
  params.append('access_token', access_token);
  const response = await fetch(
    `${config.basicDisplayApiBaseUrl}/refresh_access_token`
  );
  return await response.json();
}
