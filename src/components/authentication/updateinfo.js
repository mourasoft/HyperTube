import React, { useState, useEffect, useContext } from "react";
import { Form } from "../index";
import Message from "../notification";
import { AuthContext } from "../../context/context";
import { useHistory } from "react-router-dom";
import useForm from "../../helpers/usefom";
import validateUpdateinfo from "../../helpers/validateUpdateinfo";
import { getInstance } from "../../helpers/instance";

function Update() {
  const [img, setImg] = useState();
  const { auth } = useContext(AuthContext);
  let  history  = useHistory();
  const [data, setData] = useState({
    image: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const { handleChange, values, handleSubmit, errors } = useForm(
    submit,
    validateUpdateinfo,
    data,
    setData,
    formErrors,
    setFormErrors
  );

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file.size !== 0) {
      reader.onload = () => {
        // setImg(reader.result);
        setData((old) => ({
          ...old,
          image: reader.result
          }
        ))
        
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (auth.token) {
      getInstance(auth.token)
        .get("/account/me")
        .then((res) => {
          const { firstname, lastname, username, email, image } = res.data.user;
          setData((old) => ({
            ...old,
            firstname,
            lastname,
            username,
            email,
            image,
          }));
          // localStorage.removeItem('token');
          // localStorage.removeItem('username');
          // localStorage.removeItem('lng');
          // localStorage.removeItem('image');
          // authContext.setAuth({});
          // history.push("/signin");
        })
        .catch((e) => {});
    }
    // eslint-disable-next-line
  }, [auth.token]);
  function submit() {
    if (auth.token) {
      getInstance(auth.token)
        .post(`/account/update/info`, values)
        .then(
          (res) => {
            console.log('values : ', values);
            if (res.data.status === 200) {
              Message("success", res.data.message);
              // history.push("/library");
            }
          },
          (error) => {
            Message("error", error.response.data.message);
          }
        );
    }
  }
  console.log('this is image', data);
  return (
    <>
      <Form.Title>Update information</Form.Title>
      <Form.Base onSubmit={handleSubmit} method="POST">
        <Form.Box>
          <label htmlFor="exampleFormControlFile1">
            <Form.Image
              src={data.image }
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
        {errors.lastname && errors.lastname && (
          <Form.Para>{errors.lastname}</Form.Para>
        )}
        <Form.Input
          name="email"
          type="email"
          placeholder="Email address"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && errors.email && <Form.Para>{errors.email}</Form.Para>}
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
      
        <div style={{'display': 'flex', 'flex-direction': 'row', 'justifyContent': 'space-around'}}>
            <input type="radio" id="Choice1"
            name="langue" value="EN"/>
            <label htmlfor="Choice1">EN</label>
            <input type="radio" id="Choice2"
            name="langue" value="FR" />
            <label htmlfor="Choice1">FR</label>
          </div>
        <Form.Submit type="submit">
          UPDATE
        </Form.Submit>
      </Form.Base>
    </>
  );
}
export default Update;
