// import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Signin, Signup, Forgot, Confirm, Updatedata, Reset, User } from "./pages";
// import * as ROUTES from "./constants/routes";
import { AuthProvider, IsLoggedfn } from "./context/context";
import Library from "./pages/Library";
import Movie from "./pages/movie";
import { useEffect } from "react";

function App() {
  // console.log(authContext)

  // function isAuthenticated() {
  //   console.log(authContext.auth.token)
  //   if (authContext.auth.token !== undefined && authContext.auth.token)
  //     return true;
  //   else return false;
  // }

  const isAuthenticated = IsLoggedfn();
  // useEffect(
  //   (isAuthenticated) => {
  //     if (isAuthenticated !== undefined) {
  //       console.log(isAuthenticated);
  //     }
  //   },
  //   [isAuthenticated]
  // );

  return (
    <Router>
      <Switch>
        {/* <Route exact path={ROUTES.HOME} component={Signin} /> */}
        {/* <Route path="/" component={!isAuthenticated ? Signin : Home} /> */}
        <Route exact path="/confirm/:token" component={Confirm} />
        <Route exact path="/reset/:token" component={Reset} />
        <Route path="/updatedata" component={isAuthenticated ? Updatedata : Signin} />
        <Route path="/movie/:id" component={!isAuthenticated ? Signin : Movie} />
        <Route path="/user/:id" component={!isAuthenticated ? Signin : User} />
        <Route path="/signin" component={!isAuthenticated ? Signin : Library} />
        <Route path="/signup" component={!isAuthenticated ? Signup : Library} />
        <Route path="/forgot" component={!isAuthenticated ? Forgot : Library} />
        <Route path="/" component={isAuthenticated ? Library : Signin} />

        {/* <Route path="/home" component={isAuthenticated ? Home : Signin} /> */}
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
