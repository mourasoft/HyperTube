// import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
<<<<<<< HEAD
import { Signin, Signup, Forgot, Confirm, Updatedata, Reset, User } from "./pages";
=======
import { Signin, Signup, Forgot, Confirm, Updatedata, Reset } from "./pages";
>>>>>>> 6d99e2b669a4831ade8c8b8e76cc99c9f18d9c61
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
  console.log(isAuthenticated);
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
        <Route exact path="/confirm/:token" component={Confirm} />
        <Route exact path="/reset/:token" component={Reset} />
        <Route
          path="/updatedata"
          component={isAuthenticated ? Updatedata : Signin}
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
