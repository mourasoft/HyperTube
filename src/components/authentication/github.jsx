import { useParams, useHistory } from "react-router-dom";
import Message from "../notification";
import { Instance } from "../../helpers/instance";
import { useEffect } from "react";

export default function GitHub(props) {
  //   let params = new URLSearchParams(props.location.search).get("code");
  const history = useHistory();
  useEffect(() => {
    console.log("in use efect");
    const code = new URLSearchParams(props.location.search).get("code");
    if (code) {
      console.log(code);
      Instance.post(`/omniauth/intra/login`, { code })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          
          console.log("error", e.response);
        });
    } else {
      Message('error','Need error message Here to tell the user wrong Params');
      history.push('/signin');
    }
    //Need error message Here to tell the user wrong Params
  }, []);

  return null;
}
