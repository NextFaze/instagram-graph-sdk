import { BaseGetMediaProps, internalGetMediaForUser } from '../base-get-media';
import { config } from '../config';

export type getMediaProps = BaseGetMediaProps;

/**
 *
 * @param props GetMediaProps
 * @requires permission: [instagram_basic](https://developers.facebook.com/docs/permissions/reference#reference-instagram_basic)
 * @requires permission: [pages_show_list](https://developers.facebook.com/docs/permissions/reference#reference-pages_show_list)
 * @requires permission: [pages_read_engagement](https://developers.facebook.com/docs/permissions/reference#reference-pages_read_engagement)
 * @see [Permissions](https://developers.facebook.com/docs/instagram-api/reference/media/)
 */
export async function getMediaForUser(props: getMediaProps) {
  return internalGetMediaForUser(config.graphApiBaseUrl, { ...props });
}
