import { cleanupDirectory } from './src/helpers/cleanup-directory';

/**
 * @deprecated
 * Prefer using GraphApi.getMediaForUser
 */
export * from './src/graph-api/get-media';

/**
 * @deprecated
 * Prefer using BasicDisplayApi.refreshToken
 */
export * from './src/basic-display-api/refresh-token';

// public api
export * as GraphApi from './src/graph-api';
export * as BasicDisplayApi from './src/basic-display-api';
export const utils = {
  cleanupDirectory,
};
