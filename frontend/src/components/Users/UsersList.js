import React, { useContext } from "react";
import "./UsersList.css";
import AuthContext from "../../context/auth-context";

/**
 * It renders a list of users.
 * @param props - The props object is the object that contains the data that is passed into the
 * component.
 * @returns A list of users.
 */
const UsersList = (props) => {
  const context = useContext(AuthContext);

  return (
    <ul className="users__list">
      {props.users.map((user) => {
        return (
          <li key={user._id} className="users__item">
            <div className="user__item-data">
              <h2>{user.name}</h2>
              <p>{user.service}</p>
            </div>
            <div>
              {user.service && context.token ? (
                <button
                  className="btn"
                  onClick={props.viewDetails.bind(this, user._id)}
                >
                  View Appointments
                </button>
              ) : (
                <h4>Not a Provider</h4>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default UsersList;
