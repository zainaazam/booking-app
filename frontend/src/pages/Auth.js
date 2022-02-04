import React, { useContext, useState } from "react";
import "./Auth.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import AuthContext from "../context/auth-context";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const context = useContext(AuthContext);

  const switchMode = () => {
    setIsLogin(!isLogin);
  };
  
  const ValidationSchema = Yup.object().shape({
    email: Yup.string().trim().required("Please enter your Email!"),
    password: Yup.string().trim().required("Please enter your password!"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
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
          requestBody = {
            query: `
                        mutation {
                            createUser(userInput: {email: "${submittedValues.email}", password: "${submittedValues.password}"}) {
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
    <form className="auth-form" onSubmit={handleSubmit}>
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
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchMode}>
          Switch to {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
