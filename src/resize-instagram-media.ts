import { resizeToProps } from './get-media';
import { resizeImage } from './helpers/resize-image';

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
    if (!media.media_url || media.media_type !== 'IMAGE') {
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
    console.error('Could not resize image', err);
    return;
  }
}
