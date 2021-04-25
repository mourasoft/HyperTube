// import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  Signin,
  Signup,
  Forgot,
  Confirm,
  Updatedata,
  Reset,
  User,
  Intra,
  Github,
} from "./pages";
import { HeaderContainer } from "./containers/header";
import { FooterContainer } from "./containers/footer";
import { AuthProvider, IsLoggedfn } from "./context/context";
import Library from "./pages/Library";
import Movie from "./pages/movie";
import { useContext } from "react";
import Watchlist from "./pages/Watchlist";
import { AuthContext } from "./context/context";

function App() {
  const isAuthenticated = IsLoggedfn();
  const channel = new BroadcastChannel("logout");
  const { setAuth } = useContext(AuthContext);

  channel.addEventListener("message", (event) => {
    setAuth("");
    localStorage.clear();
  });

  return (
    <Router>
      <HeaderContainer />
      <Switch>
        <Route exact path="/confirm/:token" component={Confirm} />
        <Route exact path="/reset/:token" component={Reset} />
        <Route exact path="/omniauth/intra" component={Intra} />
        <Route exact path="/omniauth/github" component={Github} />
        {/* <Route exact path="/omniauth/intra" component={Omniauth} /> */}
        <Route path="/watchlist" component={Watchlist} />
        <Route
          path="/updatedata"
          render={(props) => {
            if (isAuthenticated) {
              if (typeof isAuthenticated === "string") return <Updatedata />;
            } else return <Signin />;
          }}
        />
        <Route
          path="/user/:id"
          render={(props) => {
            if (isAuthenticated) {
              if (typeof isAuthenticated === "string") return <User />;
              else return <Signin />;
            }
          }}
        />
        <Route
          path="/movie/:id"
          render={(props) => {
            if (isAuthenticated) {
              if (typeof isAuthenticated === "string") return <Movie />;
            } else return <Signin />;
          }}
        />
        <Route path="/signin" component={!isAuthenticated ? Signin : Library} />
        <Route path="/signup" component={!isAuthenticated ? Signup : Library} />
        <Route path="/forgot" component={!isAuthenticated ? Forgot : Library} />
        <Route
          path="/"
          render={(props) => {
            if (isAuthenticated) {
              if (typeof isAuthenticated === "string") return <Library />;
            } else return <Signin />;
          }}
        />
      </Switch>
      <FooterContainer />
    </Router>
  );
}

function AppWithStore() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
export default AppWithStore;
