import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeout } from "../functionCreate";

const AuthContext = createContext();

export const AuthWrapper = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("stt"));
  const navigate = useNavigate();

  const login = async (data) => {
    const result = {
      accessToken: data.token,
      ...data.user_profile,
    };
    localStorage.setItem("stt", JSON.stringify(result));
    await timeout(1000);
    if (data.user_profile.role == "User") {
      navigate("/task");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
