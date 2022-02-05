import React, { useContext, useState } from "react";
import "./Auth.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import AuthContext from "../context/auth-context";

/**
 * A form that allows users to either login or sign up.
 * @returns The form is being returned.
 */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signedUp, setSignedUp] = useState(false);
  const [provider, setProvider] = useState(false);
  const context = useContext(AuthContext);

  /**
   * It sets the provider variable to true or false depending on the value of the target.
   * @param event - The event that triggered the function.
   */
  const serviceHandler = (event) => {
    if (event.target.value === "provider") {
      setProvider(true);
    } else {
      setProvider(false);
    }
  };

  /**
   * *Switches the login mode between login and signup.*
   */
  const switchMode = () => {
    setIsLogin(!isLogin);
    setSignedUp(false);
  };

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().trim().required("Please enter your Email!"),
    password: Yup.string().trim().required("Please enter your password!"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        name: "",
        service: "",
        password: "",
      },
      /* 1. We create a mutation request body that contains the email and password that the user
      entered. 
      2. If the user is signing up, we create a request body that contains the email, name, service,
      and password that the user entered. 
      3. We send a POST request to the graphql endpoint with the request body. 
      4. We check the status code of the response. If it's not 200 or 201, we throw an error. 
      5. We parse the response body and get the token, userId, and tokenExpiration */
      onSubmit: async (submittedValues) => {
        let requestBody = {
          query: `
                query {
                    login(email: "${submittedValues.email}", password: "${submittedValues.password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
          `,
        };
        if (!isLogin) {
          setSignedUp(true);
          requestBody = {
            query: `
                    mutation {
                        createUser(userInput: {email: "${submittedValues.email}",name: "${submittedValues.name}", service: "${submittedValues.service}", password: "${submittedValues.password}"}) {
                            _id
                            email
                        }
                    }
                `,
          };
        }
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
            if (resData.data.login.token) {
              context.login(
                resData.data.login.token,
                resData.data.login.userId,
                resData.data.login.tokenExpiration
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      validationSchema: ValidationSchema,
    });

  return (
    <form className="auth-form">
      {!isLogin && (
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={values.name}
            error={touched.name && errors.name}
            onChange={handleChange("name")}
            onBlur={() => handleBlur("name")}
          />
        </div>
      )}
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          id="email"
          value={values.email}
          error={touched.email && errors.email}
          onChange={handleChange("email")}
          onBlur={() => handleBlur("email")}
        />
      </div>
      {!isLogin && (
        <div className="form-control">
          <label htmlFor="type">Type of user:</label>
          <select name="type" id="type" onChange={serviceHandler}>
            <option value="regular">Regular User</option>
            <option value="provider">Provider</option>
          </select>
        </div>
      )}
      {provider && !isLogin && (
        <div className="form-control">
          <label htmlFor="service">Service</label>
          <input
            type="text"
            id="service"
            value={values.service}
            error={touched.service && errors.service}
            onChange={handleChange("service")}
            onBlur={() => handleBlur("service")}
          />
        </div>
      )}
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={values.password}
          error={touched.password && errors.password}
          onChange={handleChange("password")}
          onBlur={() => handleBlur("password")}
        />
      </div>
      {!isLogin && signedUp && <h2>Successfully Done!</h2>}
      <div className="form-actions">
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={switchMode}>
          Switch to {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
