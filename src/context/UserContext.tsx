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
  changeMembershipInfos: (data: MembershipInfos[]) => void;
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
  changeMembershipInfos: () => {},
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
    const storeMembershipInfos = localStorage.getItem("membershipInfos");
    if (storeMembershipInfos) {
      setMembershipInfos(JSON.parse(storeMembershipInfos));
    }
  }, []);

  useEffect(() => {
    const _manageClubs = membershipInfos
      .filter((d: any) => !d.leaved_at && d.member_status === "active" && (d.is_staff || d.is_admin))
      .map((d: any) => {
        return {
          isStaff: d.is_staff,
          isClubAdmin: d.is_admin,
          clubId: d.book_club.id,
          clubName: d.book_club.name,
        };
      });
    if (_manageClubs.length > 0) setCurrentClubId(_manageClubs[0].clubId);
    setIsClubAdmin(membershipInfos.some((d: any) => d.is_admin && d.book_club.id === _manageClubs[0].clubId));
  }, [membershipInfos]);

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
    localStorage.setItem("language", JSON.stringify(language));
    setLanguage(language);
  };

  const changeMembershipInfos = (membershipInfos: MembershipInfos[]) => {
    localStorage.setItem("membershipInfos", JSON.stringify(membershipInfos));
    setMembershipInfos(membershipInfos);
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
        changeMembershipInfos,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
