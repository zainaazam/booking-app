import React, { useState, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import BackDrop from "../components/BackDrop/BackDrop";
import * as Yup from "yup";
import { useFormik } from "formik";
import "./Event.css";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const context = useContext(AuthContext);

  /**
   * It sets the state of the creating variable to true.
   */
  const startCreateEventHandler = () => {
    setCreating(true);
  };

  /**
   * *Set the creating flag to false and clear the selected event.*
   */
  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchEvents();
  });

  /**
   * It fetches events from the server
   */
  const fetchEvents = () => {
    const requestBody = {
      query: `
            query {
                events {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                        _id
                        name
                        email
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
        if (res.status !== 200 && res.Status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEvents(events);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ValidationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Please enter a Title!"),
    price: Yup.string().required("Please enter a Price!"),
    description: Yup.string().trim().required("Please enter a description!"),
    date: Yup.string().trim().required("Please enter a Date!"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        title: "",
        price: "",
        description: "",
        date: "",
      },
      /* The onSubmit function is called when the form is submitted. It takes the submitted values and
      creates a new event.
      
      The requestBody object is used to send the mutation to the server. The mutation is defined in
      the server.js file.
      
      The token is added to the request headers.
      
      The setEvents function is used to set the events state */
      onSubmit: async (submittedValues) => {
        const title = submittedValues.title;
        const price = +submittedValues.price;
        const description = submittedValues.description;
        const date = submittedValues.date;

        const requestBody = {
          query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    price
                    date
                }
            }
        `,
        };

        const token = context.token;

        fetch("http://localhost:8000/graphql", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => {
            if (res.status !== 200 && res.Status !== 201) {
              throw new Error("Failed!");
            }
            return res.json();
          })
          .then((resData) => {
            const updatedEvents = [...events];
            updatedEvents.push({
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              description: resData.data.createEvent.description,
              price: resData.data.createEvent.price,
              date: resData.data.createEvent.date,
              creator: {
                _id: context.userId,
              },
            });
            setEvents(updatedEvents);
          })
          .catch((err) => {
            console.log(err);
          });
        setCreating(false);
      },
      validationSchema: ValidationSchema,
    });

  /**
   * It finds the event in the events array that matches the eventId and sets the selectedEvent state
   * to that event.
   * @param eventId - The id of the event that was clicked on.
   */
  const showDetailHandler = (eventId) => {
    const selectedEvent = events.find((e) => e._id === eventId);
    setSelectedEvent(selectedEvent);
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

  return (
    <React.Fragment>
      {(creating || selectedEvent) && <BackDrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={handleSubmit}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={values.title}
                error={touched.title && errors.title}
                onChange={handleChange("title")}
                onBlur={() => handleBlur("title")}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={values.price}
                error={touched.price && errors.price}
                onChange={handleChange("price")}
                onBlur={() => handleBlur("price")}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                value={values.date}
                error={touched.date && errors.date}
                onChange={handleChange("date")}
                onBlur={() => handleBlur("date")}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={values.description}
                error={touched.description && errors.description}
                onChange={handleChange("description")}
                onBlur={() => handleBlur("description")}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}

      <EventList
        events={events}
        authUserId={context.userId}
        onViewDetail={showDetailHandler}
      />
    </React.Fragment>
  );
};

export default EventsPage;
