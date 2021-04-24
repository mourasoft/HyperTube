import React, { useState, createContext, useEffect, useContext } from "react";
import { getInstance } from "../helpers/instance";

export const AuthContext = createContext();
let username;
let token;
let image;
let language;
try {
  username = localStorage?.getItem("username");
  token = localStorage?.getItem("token");
  image = localStorage?.getItem("image");
  language = localStorage?.getItem("language");
} catch (error) {
  // username = "",
  token = "";
  // image = "";
  // language = "";
}
export function AuthProvider(props) {
  const [auth, setAuth] = useState({
    username: "",
    token: "",
    image: "",
    language: "",
  });

  useEffect(() => {
    if (token) {
      const isValid = () => {
        getInstance(token)
          .get("/account/me")
          .then((res) => {
            console.log("context", res.data.user);
            const { image, language } = res.data.user;
            setAuth((oldValue) => ({
              ...oldValue,
              token,
              image,
              language,
              username,
            }));
          })
          .catch((e) => {
            localStorage.clear();
            setAuth((oldValue) => {
              return { ...oldValue, token: null };
            });
          });
      };
      isValid();
    } else {
      setAuth((oldValue) => {
        return { ...oldValue, token: "" };
      });
      localStorage.clear();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const IsLoggedfn = () => {
  const {
    auth: { token },
  } = useContext(AuthContext);
  return token;
};

export default AuthProvider;
