import { config } from '../config';
import { BaseGetMediaProps, internalGetMediaForUser } from '../base-get-media';

export type GetMediaProps = Omit<BaseGetMediaProps, 'user_id'>;

/**
 * Calling this endpoint does not require any special permission but
 * an access token of an instagram app user
 *
 * This endpoint can only be used for reading user node that the token was generated for
 * To get media other users, please use `getMediaForUser` from `graph-api` module
 *
 * @summary Returns Media for current user
 * @param props GetMediaProps
 * @returns Media for current user
 */
export async function getMyMedia(props: GetMediaProps) {
  return internalGetMediaForUser(config.basicDisplayApiBaseUrl, {
    ...props,
    user_id: 'me',
  });
}
