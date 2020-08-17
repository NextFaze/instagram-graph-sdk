import fetch from "node-fetch";
import { baseUrl } from "./config";

export interface getMediaProps {
  user_id: string;
  fields: string[]; // fields to include in response
  limit: number | string;
  access_token: string;
  after: number | string;
}

export async function getMediaForUser({
  user_id,
  fields,
  limit = 25,
  access_token,
  after,
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

  return fetch(requestUrl, {
    method: "GET",
  }).then((data) => data.json());
}
