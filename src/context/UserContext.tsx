import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  email: string;
  is_staff: boolean;
  address: string;
  avatar: string;
  phone_number: string;
  full_name: string;
  birth_date: string;
  // Add any other properties you need for the user
}

interface UserContextProps {
  user: User | null;
  setLoggedInUser: (userData: User) => void;
  logoutUser: () => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setLoggedInUser: () => {},
  logoutUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

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
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setLoggedInUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
