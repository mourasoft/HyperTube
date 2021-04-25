import { useParams } from "react-router-dom";
import { Instance } from "../../helpers/instance";
import { useEffect } from "react";

export default function Omniauth(props) {
  //   let params = new URLSearchParams(props.location.search).get("code");
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
          console.log(e);
        });
    } else console.log("not corect"); //Need error message Here to tell the user wrong Params
  }, []);

  return null;
}
