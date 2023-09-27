import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DataProfile, UserProfileContextType } from "../types";

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider = ({
  children,
}: UserProfileProviderProps): JSX.Element => {
  const [userProfile, setUserProfile] = useState<DataProfile | null>(null);
  const validate = sessionStorage.getItem("userToken");

  const setUserProfileData = (data: DataProfile | null) => {
    setUserProfile(data);
  };

  useEffect(() => {
    fetch("https://mock-api.arikmpt.com/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${validate}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
      });
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfileData }}>
      {children}
    </UserProfileContext.Provider>
  );
};
