import { useHistory } from "react-router-dom";
import Message from "../notification";
import { Instance, imgUrl } from "../../helpers/instance";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/context";

export default function GitHub(props) {
  const { setAuth } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const code = new URLSearchParams(props.location.search).get("code");
    if (code) {
      console.log(code);
      Instance.post(`/omniauth/github/login`, { code })
        .then((res) => {
          const {
            token,
            message,
            data: { language, image },
          } = res.data;

          const t = image.startsWith("https");
          let img = t ? image : `${imgUrl}${image}`;
          try {
            localStorage.setItem("token", token);
            localStorage.setItem("language", language);
          } catch (error) {
            return;
          }
          setAuth({ language, image: img, token });
          history.push("/");
          Message("success", message);
        })
        .catch((e) => {
          console.log("error", e.response);
        });
    } else {
      Message("error", "Wrong params");
      history.push("/signin");
    }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
