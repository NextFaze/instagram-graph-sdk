import fetch from 'node-fetch';
import { resizeInstagramMedia } from './resize-instagram-media';

export type resizeToProps = {
  size: { width: number; height: number };
  destination_config: {
    path: string;
    suffix: string;
  };
};

export interface BaseGetMediaProps {
  user_id: string;
  /**
   * Refer to https://developers.facebook.com/docs/instagram for more information on supported fields
   */
  fields: string[]; // fields to include in response
  limit: number | string;
  access_token: string;
  after: number | string;
  include_thumbnail: resizeToProps;
  resize_to?: resizeToProps[];
}

export async function internalGetMediaForUser(
  baseApiUrl: string,
  {
    user_id,
    fields,
    limit = 25,
    access_token,
    after,
    resize_to,
    include_thumbnail,
  }: BaseGetMediaProps
) {
  let requestUrl = `${baseApiUrl}/${user_id}/media`;

  const params = new URLSearchParams({});
  if (fields.length) {
    params.append('fields', fields.join(','));
  }

  params.append('limit', limit + '');
  params.append('access_token', access_token);

  if (after) {
    params.append('after', after + '');
  }
  const paramsToAppend = params.toString();
  if (paramsToAppend) {
    requestUrl += `?${paramsToAppend}`;
  }

  const mediaResponse = await fetch(requestUrl, {
    method: 'GET',
  }).then(data => data.json());

  if (mediaResponse.error) {
    return Promise.reject(mediaResponse.error);
  }

  for await (const media of mediaResponse.data) {
    // resize images to given config
    if (resize_to) {
      const resizedResources = await Promise.all(
        resize_to.map(async resizeConfig => {
          const resizedImage = await resizeInstagramMedia(media, resizeConfig);
          if (!resizedImage) {
            return { size: resizeConfig.size, resized: false };
          }
          return {
            resized: true,
            size: resizeConfig.size,
            path: resizedImage,
          };
        })
      );
      media.resized_resources = resizedResources;
    }

    // include thumbnail resource
    if (include_thumbnail) {
      const thumbnailResource = await resizeInstagramMedia(
        media,
        include_thumbnail
      );

      if (thumbnailResource) {
        media.thumbnail_resource = {
          size: include_thumbnail.size,
          path: thumbnailResource,
        };
      }
    }
  }

  return mediaResponse;
}
