import { useParams, useHistory } from "react-router-dom";
import Message from "../notification";
import { Instance } from "../../helpers/instance";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/context";

export default function GitHub(props) {
  //   let params = new URLSearchParams(props.location.search).get("code");
  const { setAuth } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    console.log("in use efect");
    const code = new URLSearchParams(props.location.search).get("code");
    console.log(code);
    if (code) {
      console.log(code);
      Instance.post(`/omniauth/github/login`, { code })
        .then((res) => {
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
        })
        .catch((e) => {
          console.log("error", e.response);
        });
    } else {
      Message("error", "Need error message Here to tell the user wrong Params");
      history.push("/signin");
    }
    // Need error message Here to tell the user wrong Params
  }, []);

  return null;
}
