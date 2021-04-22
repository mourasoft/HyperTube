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
} from "./pages";
// import * as ROUTES from "./constants/routes";
import { AuthProvider, IsLoggedfn } from "./context/context";
import Library from "./pages/Library";
import Movie from "./pages/movie";
import { useEffect } from "react";

function App() {
  const isAuthenticated = IsLoggedfn();

  return (
    <Router>
      <Switch>
        <Route exact path="/confirm/:token" component={Confirm} />
        <Route exact path="/reset/:token" component={Reset} />
        <Route
          path="/updatedata"
          component={isAuthenticated ? Updatedata : Signin}
        />
        <Route
          path="/user/:id"
          component={isAuthenticated ? User : Signin}
        />
        <Route
          path="/movie/:id"
          render={(props) => {
            if (isAuthenticated !== undefined) {
              if (typeof isAuthenticated === "string") return <Movie />;
              else return <Signin />;
            }
          }}
        />
        <Route path="/signin" component={!isAuthenticated ? Signin : Library} />
        <Route path="/signup" component={!isAuthenticated ? Signup : Library} />
        <Route path="/forgot" component={!isAuthenticated ? Forgot : Library} />
        <Route
          path="/"
          render={(props) => {
            if (isAuthenticated !== undefined) {
              if (typeof isAuthenticated === "string") return <Library />;
              else return <Signin />;
            }
          }}
        />
      </Switch>
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
