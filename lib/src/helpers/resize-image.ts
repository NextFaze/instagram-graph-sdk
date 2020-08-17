import Jimp from "jimp";

export interface resizeImageProps {
  size: { width: number; height: number };
  source_url: string;
  destination_path: string;
}

export async function resizeImage({
  source_url,
  size: { width = Jimp.AUTO, height = Jimp.AUTO },
  destination_path,
}: resizeImageProps) {
  const image = await Jimp.read(source_url);
  return image.resize(width, height).writeAsync(destination_path);
}
