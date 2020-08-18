import { rmdir } from 'fs';

// removes all the tmp files
// if no options provided, recursively removes files from given directory path
export async function cleanupDirectory(
  path: string,
  options?: { recursive: boolean }
) {
  return rmdir(path, { recursive: options?.recursive || true }, (err: any) => {
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  });
}
