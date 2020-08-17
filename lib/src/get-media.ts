import fetch from "node-fetch";
import { baseUrl } from "./config";

export interface getMediaProps {
  userId: string;
  fields: string[]; // fields to include in response
  limit: number | string;
  access_token: string;
}

export async function getMediaForUser({
  userId,
  fields,
  limit = 25,
  access_token,
}: getMediaProps) {
  const requestUrl = `${baseUrl}/v8.0/${userId}/media`;

  const params = new URLSearchParams({});
  if (fields.length) {
    params.append("fields", fields.join(","));
  }

  params.append("limit", limit + "");
  params.append("access_token", access_token);
  requestUrl.concat(`?${params}`);

  return fetch(requestUrl, {
    method: "GET",
  }).then((data) => data.json());
}
