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
  include_thumbnail: resizeToProps;
  resize_to?: resizeToProps[];
}

export async function getMediaForUser({
  user_id,
  fields,
  limit = 25,
  access_token,
  after,
  resize_to,
  include_thumbnail,
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

  for await (const media of mediaResponse.data) {
    // resize images to given config
    if (resize_to) {
      const resizedResources = await Promise.all(
        resize_to.map(async (resizeConfig) => {
          const resizedImage = await resizeInstagramMedia(media, resizeConfig);
          if (!resizedImage) {
            return { size: resizeConfig.size, resized: false };
          }
          return {
            resized: true,
            size: resizeConfig.size,
            resized_resource_path: resizedImage,
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
          thumbnail_resource_path: thumbnailResource,
        };
      }
    }
  }

  return mediaResponse;
}

export async function resizeInstagramMedia(
  media: any,
  resizeConfig: resizeToProps
) {
  try {
    // do not resize if one of the config is missing
    if (
      !resizeConfig.destination_config ||
      !resizeConfig.destination_config.path ||
      !resizeConfig.destination_config.suffix
    ) {
      return;
    }

    // if current media is not a image resize operation can not be applied
    if (!media.media_url || media.media_type !== "IMAGE") {
      return;
    }

    const { path, suffix } = resizeConfig.destination_config;
    const destinationPath = `${path}/${media.shortcode || media.id}${suffix}`;

    await resizeImage({
      size: resizeConfig.size,
      source_url: media.media_url,
      destination_path: destinationPath,
    });

    return destinationPath;
  } catch (err) {
    console.error("Could not resize image", err);
    return;
  }
}
