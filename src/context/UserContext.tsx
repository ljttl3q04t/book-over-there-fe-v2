import { MembershipInfos } from "@/services/types";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  email: string;
  is_staff: boolean;
  is_club_admin: boolean;
  address: string;
  avatar: string;
  phone_number: string;
  full_name: string;
  birth_date: string;
  user_id: number;
  membership_info: MembershipInfos[];
  is_verify: boolean;
}

interface UserContextProps {
  user: User | undefined;
  setLoggedInUser: (userData: User) => void;
  logoutUser: () => void;
  language: string;
  changeLanguage: (language: string) => void;
  currentClubId: number | undefined;
  setCurrentClubId: (clubId: number | undefined) => void;
  isClubAdmin: boolean;
  setIsClubAdmin: (value: boolean) => void;
  membershipInfos: MembershipInfos[];
  setMembershipInfos: (data: MembershipInfos[]) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  setLoggedInUser: () => {},
  logoutUser: () => {},
  language: "",
  changeLanguage: () => {},
  currentClubId: undefined,
  setCurrentClubId: () => {},
  isClubAdmin: false,
  setIsClubAdmin: () => {},
  membershipInfos: [],
  setMembershipInfos: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [membershipInfos, setMembershipInfos] = useState<MembershipInfos[]>([]);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [currentClubId, setCurrentClubId] = useState<number | undefined>(undefined);
  const lang = localStorage.getItem("i18nextLng");

  const [language, setLanguage] = useState<string>(lang ? lang : "vi");

  useEffect(() => {
    // Load the user data from localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setLoggedInUser = (userData: User) => {
    // Save the user data to localStorage when setting the logged-in user
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    // Clear the user data from localStorage when logging out
    localStorage.removeItem("user");
    setUser(undefined);
  };

  const changeLanguage = (language: string) => {
    // Save the user data to localStorage when setting the logged-in user
    localStorage.setItem("language", JSON.stringify(language));
    setLanguage(language);
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setLoggedInUser,
        logoutUser,
        language,
        changeLanguage,
        currentClubId,
        setCurrentClubId,
        isClubAdmin,
        setIsClubAdmin,
        membershipInfos,
        setMembershipInfos,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
