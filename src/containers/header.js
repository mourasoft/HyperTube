import React, { useState, useContext } from "react";
import { Header } from "../components";
import * as ROUTES from "../constants/routes";
import logo from "../hypertube.png";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import { Avatar, Button } from "@material-ui/core";
import MovieIcon from "@material-ui/icons/Movie";
import { IsLoggedfn, AuthContext } from "../context/context";
import { useHistory } from "react-router-dom";

export function HeaderContainer() {
  const { setAuth } = useContext(AuthContext);
  const history = useHistory();

  const LogoutFn = () => {
    setAuth({ token: "" });
    localStorage.clear();
    history.go("/");
  };
  const isLogged = IsLoggedfn();
  // console.log(isLogged);
  // console.log(authContext);
  // const isLogegd;
  if (isLogged) return <Logged LogoutFn={LogoutFn} />;
  else return <NotLogged />;
}

function NotLogged() {
  return (
    <Header>
      <Header.Frame>
        <Header.Logo to={ROUTES.HOME} src={logo} alt="Hypertube" />
        <Header.ButtonLink to="/Signup">SignUp</Header.ButtonLink>
      </Header.Frame>
    </Header>
  );
}

function Logged({ LogoutFn }) {
  const history = useHistory();
  return (
    <Header>
      <Header.Frame>
        <Header.Logo to={ROUTES.HOME} src={logo} alt="Hypertube" />
        <Header.ButtonLink to="/Signup">
          <i>
            <MovieIcon />
          </i>
        </Header.ButtonLink>
        <Avatar
          onClick={() => {
            history.push("/updatedata");
            console.log("clicked");
          }}
          src={`https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3152&q=80`}
        />
        <Button onClick={() => LogoutFn()}>
          <i>
            <LogoutIcon style={{ color: "#dc1b28" }} />
          </i>
        </Button>
      </Header.Frame>
    </Header>
  );
}
