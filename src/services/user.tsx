import { ApiServiceAuthor, axiosApi } from "../http-common";
import { BookClubInfo } from "./types";

type ResetPasswordParams = {
  username_or_email: string;
};

type UpdatePasswordParams = {
  uid: string;
  token: string;
  newPassword: string;
};

const registerUser = (data: any) => {
  return axiosApi.post("/user/register", data);
};

const getUser = () => {
  return ApiServiceAuthor.get("/user/info");
};

const getUserMembership = () => {
  return ApiServiceAuthor.get("/user/membership");
};

async function getStaffClubs(): Promise<BookClubInfo[]> {
  try {
    const response = await ApiServiceAuthor.get("/user/membership");
    const data = response.data;
    return data.filter((d: any) => d["is_staff"]).map((d: any) => d["book_club"]);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

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

async function resetPassword(data: ResetPasswordParams): Promise<string> {
  try {
    const response = await axiosApi.post("user/password-reset", data);
    const { message } = response.data;
    return message;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function updatePassword(data: UpdatePasswordParams): Promise<string> {
  try {
    const { uid, token, newPassword } = data;
    const response = await axiosApi.post(`password-reset/confirm/${uid}/${token}`, { new_password: newPassword });
    const { message } = response.data;
    return message;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const userService = {
  registerUser,
  getUser,
  updateUser,
  getUserMembership,
  getUserShareClub,
  resetPassword,
  updatePassword,
  getStaffClubs,
};
export default userService;
