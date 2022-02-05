import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import UsersPage from "./pages/Users";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);


/**
 * It takes in a token and a userId, and sets the token and userId in the state
 * @param token - The token that was returned from the server.
 * @param userId - The user's ID.
 */
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

 /**
  * Logout the user by clearing the token and userId from the state
  */
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  /* We create a context object that contains the user's token and userId. We then create a provider
  component that wraps the entire application and passes the context object to it.
  
  The provider component is the only component that needs to be aware of the context object. It
  passes the context object to all of its children.
  
  The context object is then passed to the main navigation component.
  
  The main navigation component is responsible for rendering the links to the different pages. It
  also renders the login and logout buttons.
  
  The main navigation component is wrapped in the AuthContext.Provider component */
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            login: login,
            logout: () => logout(),
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/users" exact />}
              {token && <Redirect from="/auth" to="/users" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/users" component={UsersPage} />
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
