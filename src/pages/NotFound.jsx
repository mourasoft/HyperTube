import React from "react";
import { makeStyles } from "@material-ui/core";

export default function NotFound() {
  const classes = useStyles();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "90vh",
        backgroundImage: `url("/images/wallpaper.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "100px",
          color: "white",
        }}
      >
        404 Error
      </h2>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    color: "#E4E6EB",
    marginTop: "5%",
  },
}));
