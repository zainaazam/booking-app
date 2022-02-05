import React from "react";

/* The React Context API is a way to provide data to all components in the application without having
to pass props down the component tree.  */
export default React.createContext({
  token: null,
  userId: null,
  login: (token, userId) => {},
  logout: () => {},
});
