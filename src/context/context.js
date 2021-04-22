import React, { useState, createContext, useEffect, useContext } from "react";
import { getInstance } from "../helpers/instance";

export const AuthContext = createContext();
let login;
let token;
let image;
let lng;
try {
  login = localStorage?.getItem("username");
  token = localStorage?.getItem("token");
  image = localStorage?.getItem("image");
  lng = localStorage?.getItem("lng");
} catch (error) {
  login = "";
  token = "";
  image = "";
  lng = "";
}
export function AuthProvider(props) {
  const [auth, setAuth] = useState({});
  // const history = useHistory();
  useEffect(() => {
    if (token) {
      const isValid = () => {
        getInstance(token)
          .get("/account/me")
          .then((res) => {
            if (res.status === 200) {
              setAuth((oldValue) => ({
                ...oldValue,
                token,
              }));
            }
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
        return { ...oldValue, token: null };
      });

      localStorage.clear();
    }
  }, [token]);

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
