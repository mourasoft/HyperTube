import React, { useState, useEffect, useContext } from "react";
import { Form } from "../index";
import Message from "../notification";
import { AuthContext } from "../../context/context";
import useForm from "../../helpers/usefom";
import validateUpdateinfo from "../../helpers/validateUpdateinfo";
import { getInstance } from "../../helpers/instance";

function Update() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState({
    image: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    language: ""
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
    if (file && file.size !== 0) {
      reader.onload = () => {
        getInstance(auth.token)
        .post("/account/upload", {image: reader.result}).then(res => {
          Message('success', res.data.message);
          // localStorage.setItem("image", res.data.data.image);
          setData((old) => 
         ({...old,
         image: res.data.image})
       )
        }).catch(e => {
          if(e.response){
            Message('error', e.response.data.message)
          }
        })  
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (auth.token) {
      getInstance(auth.token)
        .get("/account/me")
        .then((res) => {
          // console.log("all data", res.data);
          const { firstname, lastname, username, email, image, language } = res.data.user;
          setData((old) => ({
            ...old,
            firstname,
            lastname,
            username,
            email,
            image,
            language,
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
  }, [auth.token, data.image]);
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
  console.log('language', data.language);
  
  return (
    <>
    
      <Form.Title>Update information</Form.Title>
      <Form.Base onSubmit={handleSubmit} method="POST">
        <Form.Box>
          <label htmlFor="exampleFormControlFile1">
            <Form.Image
              src={`http://10.12.7.10:5000${data.image}`}
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
      
        <div style={{'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'space-around'}}>
          
            <input type="radio" id="Choice1"
            name="language" value="EN" onChange={e => setData((old) => 
              ({...old,
                language: e.target.value})
            )} checked={data.language === 'EN' ? true : false}/>
            <label htmlFor="Choice1">EN</label>
            <input type="radio" id="Choice2"
            name="language" value="FR" onChange={e => setData((old) => 
              ({...old,
                language: e.target.value})
            )} checked={data.language === 'FR' ? true : false} />
            <label htmlFor="Choice1">FR</label>
          </div>
        <Form.Submit type="submit">
          UPDATE
        </Form.Submit>
      </Form.Base>
    </>
  );
}
export default Update;
