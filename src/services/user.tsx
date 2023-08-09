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

const getUserMembership = () => {
  return ApiServiceAuthor.get("/user/membership");
};

async function getStaffClubs(): Promise<BookClubInfo[]> {
  try {
    const response = await ApiServiceAuthor.get("/user/membership");
    if (response.data) {
      const data = response.data;
      return data.filter((d: any) => d["is_staff"]).map((d: any) => d["book_club"]);
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

const getUserShareClub = (data: any) => {
  return ApiServiceAuthor.post("/user/book/share-club", data);
};

async function updateUser(data: any) {
  try {
    const formData = new FormData();
    if (data.email) formData.append("email", data.email);
    if (data.phone_number) formData.append("phone_number", data.phone_number);
    if (data.address) formData.append("address", data.address);
    if (data.full_name) formData.append("full_name", data.full_name);
    if (data.birth_date) formData.append("birth_date", data.birth_date);
    if (data.avatar) formData.append("avatar", data.avatar);
    const response = await ApiServiceAuthor.put("/user/info/update", formData);
    if (response.data) {
      return response.data;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

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

async function sendOTP(): Promise<string> {
  try {
    const response = await ApiServiceAuthor.post("otp/generate", undefined);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function verifyOTP(code: string): Promise<string> {
  try {
    const response = await ApiServiceAuthor.post(`otp/verify/${code}`, undefined);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

async function changePassword(data: any): Promise<string> {
  try {
    const response = await ApiServiceAuthor.post(`user/change-password`, data);
    if (response.data.message) {
      return response.data.message;
    } else {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
}

const userService = {
  registerUser,
  updateUser,
  getUserMembership,
  getUserShareClub,
  resetPassword,
  updatePassword,
  getStaffClubs,
  sendOTP,
  verifyOTP,
  changePassword,
};
export default userService;
