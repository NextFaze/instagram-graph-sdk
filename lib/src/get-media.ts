import fetch from "node-fetch";
import { baseUrl } from "./config";
import { resizeImage, resizeImageProps } from "./resize-image";

type resizeToProps = {
  size: { width: number; height: number };
  destination_config: {
    path: string;
    suffix: string;
  };
};

export interface getMediaProps {
  user_id: string;
  fields: string[]; // fields to include in response
  limit: number | string;
  access_token: string;
  after: number | string;
  includeThumbnail:
    | {
        height: number;
        width: number;
      }
    | boolean;
  resize_to?: resizeToProps[];
}

export async function getMediaForUser({
  user_id,
  fields,
  limit = 25,
  access_token,
  after,
  resize_to,
}: getMediaProps) {
  let requestUrl = `${baseUrl}/v8.0/${user_id}/media`;

  const params = new URLSearchParams({});
  if (fields.length) {
    params.append("fields", fields.join(","));
  }

  params.append("limit", limit + "");
  params.append("access_token", access_token);

  if (after) {
    params.append("after", after + "");
  }
  const paramsToAppend = params.toString();
  if (paramsToAppend) {
    requestUrl += `?${paramsToAppend}`;
  }

  const mediaResponse = await fetch(requestUrl, {
    method: "GET",
  }).then((data) => data.json());

  if (mediaResponse.error) {
    return Promise.reject(mediaResponse.error);
  }

  if (resize_to?.length) {
    const resizedMediaResponse = [] as any[];
    for await (const resizeConfig of resize_to) {
      // for each config image is resized and saved under given path

      const resizedMedia = {
        ...mediaResponse,
        data: await Promise.all(
          mediaResponse.data.map(async (media: any) => {
            if (!resizeConfig.destination_config) {
              return Promise.resolve(media);
            }

            if (!media.media_url || media.media_type !== "IMAGE") {
              // if current media is not a image resize operation can not be applied
              return Promise.resolve(media);
            }
            const { path, suffix } = resizeConfig.destination_config;

            const destinationPath = `${path}/${
              media.shortcode || media.id
            }${suffix}`;

            await resizeImage({
              size: resizeConfig.size,
              source_url: media.media_url,
              destination_path: destinationPath,
            });

            return Promise.resolve({
              ...media,
              resized_media_path: destinationPath,
            });
          })
        ),
      };

      resizedMediaResponse.push(resizedMedia);
    }
    return resizedMediaResponse;
  }
  return mediaResponse;
}
