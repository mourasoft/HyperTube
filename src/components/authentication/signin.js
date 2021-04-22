import React, { useContext, useState } from "react";
import { HeaderContainer } from "../../containers/header";
import { Form } from "../index";
import { FooterContainer } from "../../containers/footer";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import { GrFacebook } from "react-icons/gr";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/context";
import useForm from "../../helpers/usefom";
import validateSignIn from "../../helpers/validateSignin";
import Message from "../notification";
import { Instance } from "../../helpers/instance";

export default function Signin() {
  //// TESTING
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
        console.log(res.data);
        if (res.data.status === 200) {
          try {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("lng", res.data.data.language);
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
        console.log(error.response);
        if (error.response) Message("error", error.response?.data.message);
        else Message("error", "Undefined Error");
      }
    );
  }

  return (
    <>
      <HeaderContainer />
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
        <Form.Omniauth type="submit">
          <GrFacebook />
        </Form.Omniauth>
        <Form.Omniauth type="submit">
          <FcGoogle />
        </Form.Omniauth>
        <Form.Omniauth type="submit">
          <FiGithub />
        </Form.Omniauth>
      </Form>

      <FooterContainer />
    </>
  );
}
