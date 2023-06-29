import { ApiServiceAuthor, axiosApi } from "../http-common";

const registerUser = (data: any) => {
  return axiosApi.post("/user/register", data);
};

const getUser = () => {
  return ApiServiceAuthor.get("/user/info");
};

const getUserMembership = () => {
  return ApiServiceAuthor.get("/user/membership");
};

const getUserShareClub = (data: any) => {
  return ApiServiceAuthor.post("/user/book/share-club", data);
};

const updateUser = (data: any) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("phone_number", data.phone_number);
  formData.append("address", data.address);
  formData.append("full_name", data.full_name);
  formData.append("birth_date", data.birth_date);
  formData.append("avatar", data.avatar);
  return ApiServiceAuthor.put("/user/info/update", formData);
};

const userService = {
  registerUser,
  getUser,
  updateUser,
  getUserMembership,
  getUserShareClub,
};
export default userService;
