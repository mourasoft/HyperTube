import React, { useContext, useState, useEffect } from "react";
import { Form } from "../index";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import { GrFacebook } from "react-icons/gr";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/context";
import useForm from "../../helpers/usefom";
import validateSignIn from "../../helpers/validateSignin";
import Message from "../notification";
import { Instance, urlGithub, urlIntra } from "../../helpers/instance";

export default function Signin() {
  const { setAuth } = useContext(AuthContext);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });
  const { handleChange, values, handleSubmit, errors } = useForm(
    submit,
    validateSignIn,
    data,
    setData,
    formErrors,
    setFormErrors
  );

  let history = useHistory();
  function submit() {
    Instance.post("/auth/login", data).then(
      (res) => {
        if (res.data.status === 200) {
          try {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("language", res.data.data.language);
            localStorage.setItem("image", res.data.data.image);
            localStorage.setItem("username", res.data.data.username);
          } catch (error) {
            return;
          }

          const login = res.data.data.username;
          const token = res.data.token;
          const lng = res.data.data.language;
          const image = res.data.data.image;
          setAuth({ lng, image, token, login });
          history.push("/");
          Message("success", res.data.message);
        }
      },
      (error) => {
        if (error.response) Message("error", error.response?.data.message);
        else Message("error", "Undefined Error");
      }
    );
  }
  useEffect(() => {
    document.title = "HyperTube | Signin ";
  });
  return (
    <>
      {/* <HeaderContainer /> */}
      <Form>
        <Form.Title>Sign In</Form.Title>
        <Form.Base onSubmit={handleSubmit} method="POST">
          <Form.Input
            type="text"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={handleChange}
          />
          {errors.username && errors.username && (
            <Form.Para>{errors.username}</Form.Para>
          )}
          <Form.Input
            type="password"
            name="password"
            value={values.password}
            autoComplete="off"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && errors.password && (
            <Form.Para>{errors.password}</Form.Para>
          )}
          <Form.Submit type="submit" data-testid="sign-in">
            Sign In
          </Form.Submit>
        </Form.Base>
        <Form.Text>
          New to Hypertube? <Form.Link to="/signup">Sign up now.</Form.Link>
        </Form.Text>
        <Form.Text>
          Forgot password? <Form.Link to="/forgot">Forgot.</Form.Link>
        </Form.Text>
        <Form.Omniauth onClick={() => window.open(urlIntra)}>
          <Gr42school />
        </Form.Omniauth>
        <Form.Omniauth type="submit">
          <GrFacebook />
        </Form.Omniauth>
        <Form.Omniauth type="submit">
          <FcGoogle />
        </Form.Omniauth>
        <Form.Omniauth onClick={() => window.open(urlGithub)}>
          <FiGithub />
        </Form.Omniauth>
      </Form>
    </>
  );
}
function Gr42school() {
  return (
    <>
      <img
        style={{ width: "1em", height: "1em" }}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/512px-42_Logo.svg.png"
        alt="42"
      />
    </>
  );
}
