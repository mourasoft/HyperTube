import React, { useState, createContext, useEffect, useContext } from "react";
import { getInstance } from "../helpers/instance";

export const AuthContext = createContext();
let login;
let token;
let image;
let lng;
try {
  token = localStorage?.getItem("token");
  image = localStorage?.getItem("image");
  lng = localStorage?.getItem("lng");
} catch (error) {
  token = "";
  image = "";
  lng = "";
}
export function AuthProvider(props) {
  const [auth, setAuth] = useState({
    login: "",
    token: "",
    image: "",
    lng: "",
  });
  // console.log(auth);
  // const history = useHistory();
  useEffect(() => {
    // console.log("context in ");
    if (token) {
      const isValid = () => {
        getInstance(token)
          .get("/account/me")
          .then((res) => {
            // console.log(res.data.user);
            const { image, language } = res.data.user;
            setAuth((oldValue) => ({
              ...oldValue,
              token,
              image,
              lng: language,
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
