import React, { useState, useEffect, useContext } from "react";
import UsersList from "../components/Users/UsersList";
import Modal from "../components/Modal/Modal";
import EventList from "../components/Events/EventList/EventList";
import BackDrop from "../components/BackDrop/BackDrop";
import "./Users.css";
import { BiSearchAlt2 } from "react-icons/bi";
import AuthContext from "../context/auth-context";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserEvents, setSelectedUserEvents] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const context = useContext(AuthContext);

  /**
   * It sets the searchWord variable to the value of the input field.
   * @param event - The event object that is passed to the callback function.
   */
  const saveValue = (event) => {
    const searchValue = event.target.value;
    setSearchWord(searchValue);
  };

  /**
   * Filter the users array by the searchWord string
   * @returns Nothing.
   */
  const search = () => {
    const updatedUsers = users?.filter((user) => {
      return searchWord
        ? user.name.toLowerCase().includes(searchWord.toLowerCase())
        : true;
    });
    return setUsers(updatedUsers);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);

  /**
   * It fetches all users from the database and stores them in the users array
   */
  const fetchUsers = () => {
    const requestBody = {
      query: `
          query {
            users {
              _id
              email
              name
              service
              createdEvents {
              _id
              title
              description
              date
              price
              creator {
                  _id
              }
              }
            }
          }
        `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const users = resData.data.users;
        setUsers(users);
        if (searchWord) {
          search();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * If the user is logged in, then book the event
   * @returns The bookEvent mutation returns the updated event.
   */
  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${selectedEvent._id}") {
              _id
             createdAt
             updatedAt
            }
          }
        `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Given a userId, find the user in the users array and set the selectedUserEvents state to the
   * user's createdEvents array
   * @param userId - The id of the user that was clicked on.
   */
  const showDetailHandler = (userId) => {
    const selectedUser = users.find((e) => e._id === userId);
    const selectedUserEvents = selectedUser.createdEvents;
    setSelectedUserEvents(selectedUserEvents);
  };

  /**
   * *Cancel the modal.*
   */
  const modalCancelHandler = () => {
    setSelectedUserEvents(null);
    setSelectedEvent(null);
  };

  /**
   * It finds the event in the selectedUserEvents array that has the same id as the eventId parameter
   * and sets the selectedEvent state to that event.
   * @param eventId - The id of the event that was clicked.
   */
  const viewDetailsHandler = (eventId) => {
    const selectedEvent = selectedUserEvents.find((e) => e._id === eventId);
    setSelectedEvent(selectedEvent);
  };

  return (
    <React.Fragment>
      <div className="search">
        <input
          className="searchBar"
          placeholder="Search Sellers"
          value={searchWord}
          onChange={saveValue}
        />
        <div className="searchIcon">
          <BiSearchAlt2 size={25} />
        </div>
      </div>
      <div>
        <UsersList users={users} viewDetails={showDetailHandler} />
      </div>
      {selectedUserEvents && <BackDrop />}
      {selectedUserEvents && (
        <Modal title={"Events"} canCancel onCancel={modalCancelHandler}>
          <EventList
            events={selectedUserEvents}
            onViewDetail={viewDetailsHandler}
          />
          {selectedEvent && (
            <div className="details">
              <p>{new Date(selectedEvent.date).toLocaleString()}</p>
              <p>{selectedEvent.description}</p>
              <button className="btn" onClick={bookEventHandler}>
                book
              </button>
            </div>
          )}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default UsersPage;
