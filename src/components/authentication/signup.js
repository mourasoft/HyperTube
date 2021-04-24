import React, { useState, useEffect } from "react";
import { Form } from "../index";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import { GrFacebook } from "react-icons/gr";
import Message from "../notification";
import useForm from "../../helpers/usefom";
import validateSignUp from "../../helpers/validateSignup";
import { useHistory } from "react-router-dom";
import { Instance } from "../../helpers/instance";

export default function Signup() {
  //// TESTING
  const [data, setData] = useState({
    image: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  
  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const { handleChange, values, handleSubmit, errors } = useForm(
    submit,
    validateSignUp,
    data,
    setData,
    formErrors,
    setFormErrors
  );

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target?.files[0];
    if (file && file.size) {
      reader.onload = () => {
       setData((old) => 
         ({...old,
         image: reader.result})
       )
      };
      reader.readAsDataURL(file);
    }
  };
  let history = useHistory();
  function submit() {
    Instance.post(`/auth/register`, values).then(
      (res) => {
        console.log("object");
        if (res.data?.status === 200) {
          history.push("/signin");
          Message("success", res.data.message);
        }
      },
      (error) => {
        if (error.response) {
          Message("error", error.response.data.message);
        }
      }
    );
  }
  useEffect(() => {
    document.title = "HyperTube | Signup ";
  });
  return (
    <>
      <Form>
        <Form.Title>Sign Up</Form.Title>
        <Form.Base onSubmit={handleSubmit} method="POST">
        <Form.Box>
          <label htmlFor="exampleFormControlFile1">
            <Form.Image
              src={data.image ? data.image : `http://10.12.7.10:5000/images/default.svg`}
            />
          </label>
          <input
            type="file"
            hidden
            onChange={photoUpload}
            className="form-control-file"
            id="exampleFormControlFile1"
            accept="image/*"
          />
        </Form.Box>
          <Form.Input
            name="firstname"
            placeholder="First Name"
            value={values.firstname}
            onChange={handleChange}
          />
          {errors.firstname && errors.firstname && (
            <Form.Para>{errors.firstname}</Form.Para>
          )}
          <Form.Input
            name="lastname"
            placeholder="Last Name"
            value={values.lastname}
            onChange={handleChange}
          />
          {errors.lastname && errors.lastname && (
            <Form.Para>{errors.lastname}</Form.Para>
          )}
          <Form.Input
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && errors.username && (
            <Form.Para>{errors.username}</Form.Para>
          )}
          <Form.Input
            name="email"
            type="email"
            placeholder="Email address"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && errors.email && (
            <Form.Para>{errors.email}</Form.Para>
          )}
          <Form.Input
            name="password"
            type="password"
            value={values.password}
            autoComplete="off"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && errors.password && (
            <Form.Para>{errors.password}</Form.Para>
          )}
          <Form.Input
            name="confirm"
            type="password"
            value={values.confirm}
            autoComplete="off"
            placeholder="Confim Password"
            onChange={handleChange}
          />
          {errors.confirm && errors.confirm && (
            <Form.Para>{errors.confirm}</Form.Para>
          )}
          <Form.Submit type="submit">Sign Up</Form.Submit>
        </Form.Base>

        <Form.Text>
          Have an account? <Form.Link to="/signin">Sign in now.</Form.Link>
        </Form.Text>
        <Form.Omniauth onClick={()=>console.log("was clicked")}>
          <Gr42school />
        </Form.Omniauth>
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
    </>
  );
}

function Gr42school(){
  return (
    <>
    <img style={{"width": "1em", "height": "1em"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/512px-42_Logo.svg.png" alt="42"/>
    </>
  )
}