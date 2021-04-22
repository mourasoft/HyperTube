import React, { useState, useContext, useEffect } from "react";
import { HeaderContainer } from "../../containers/header";
import { Form } from "../index";
import { FooterContainer } from "../../containers/footer";
import { AuthContext } from "../../context/context";
import { useHistory, useParams } from 'react-router-dom';
import { getInstance } from "../../helpers/instance";
export default function User() {
  //// TESTING

  const { auth } = useContext(AuthContext);
  const { history } = useHistory();
  const { id } = useParams();
  console.log('id : ', id)
  
  const [data, setData] = useState({
    image: "",
    firstname: "",
    lastname: "",
    username: "",
  });
const [img, setImg] = useState();

  useEffect(() => {
    if (auth.token) {
      getInstance(auth.token)
        .get(`/account/${id}`)
        .then((res) => {
          const { firstname, lastname, username, image } = res.data.data;
          setData((old) => ({
            ...old,
            firstname,
            lastname,
            username,
            image
          }));
          // console.log(data);
          // localStorage.removeItem('token');
          // localStorage.removeItem('username');
          // localStorage.removeItem('lng');
          // localStorage.removeItem('image');
          // authContext.setAuth({});
          
        })
        .catch((e) => {});
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <>
      <HeaderContainer/>
        <Form>
        <Form.Title>Update information</Form.Title>
      <Form.Base method="POST">

      <Form.Box>
          <label htmlFor="exampleFormControlFile1">
            <Form.Image
              src={!img ? "http://localhost:5000/images/default.svg" : img}
            />
          </label>
        </Form.Box>
        <Form.Input
          name="firstname"
          placeholder="First Name"
          value={data.firstname}
            disabled
        />
        <Form.Input
          name="lastname"
          placeholder="Last Name"
          value={data.lastname}
            disabled
        />
        <Form.Input
          name="username"
          placeholder="Username"
          value={data.username}
            disabled
        />
      </Form.Base>
      <Form.Row>
      <Form.Title>First</Form.Title>
      <Form.Title>First</Form.Title>
      <Form.Title>Last</Form.Title>
      </Form.Row>
        </Form>
      <FooterContainer />
    </>
  );
}
