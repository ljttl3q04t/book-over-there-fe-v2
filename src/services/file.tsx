import { ApiServiceAuthor } from "../http-common";

export const uploadFile = (data: any) => {
  return ApiServiceAuthor.post("/upload", data);
};

