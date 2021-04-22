import React, { useEffect, useState, useContext } from "react";
import { Avatar, makeStyles, TextField, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { getInstance } from "../../helpers/instance";
import { AuthContext } from "../../context/context";

// movie/comment

/*
 * id
 * comment
 */

export default function Comments({ id }) {
  const authContext = useContext(AuthContext);
  const { token } = authContext.auth;
  const [comment, setcomment] = useState("");
  useEffect(() => {
    /*
     *Get all Comments form server
     */
  }, []);

  const handleComment = (e) => {
    /*
     *post new message
     */
    setcomment(e.target.value);
  };
  console.log(comment);
  const send = () => {
    /*
     *handle the submit to not reload Page
     */
    getInstance(token)
      .post("/movie/comment", { id, comment })
      .then((res) => {
        console.log(res);
      });
  };
  const classes = useStyles();
  return (
    <div className={classes.commentPaper}>
      <div
        style={{
          width: "90%",
          backgroundColor: "#242526",
          borderRadius: "10px",
          justifyContent: "center",
          padding: "20px",
          flexDirection: "column",
        }}
      >
        <HeadComent
          classes={classes}
          handleComment={handleComment}
          comment={comment}
          send={send}
        />
        <Comment />
      </div>
    </div>
  );
}

function HeadComent({ classes, handleComment, comment, send }) {
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ flexBasis: "5%", marginRight: "15px" }}>
        <Avatar />
      </div>
      <div style={{ flexBasis: "90%" }}>
        <TextField
          className={classes.comment}
          variant="outlined"
          onChange={handleComment}
          placeholder="Write a comment"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => send()}
                style={{
                  color: "#757980",
                }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        ></TextField>
      </div>
    </div>
  );
}

function Comment() {
  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flexBasis: "5%", marginRight: "15px" }}>
          <Avatar />
        </div>
        <div style={{ flexBasis: "90%" }}>
          <div style={{ marginBottom: "8px" }}>Mouras</div>
          <div>
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
            eveniet accusamus ducimus incidunt porro ad aliquam, laudantium
            velit placeat facilis, impedit debitis sequi. Blanditiis nesciunt
            esse minima voluptatem. Quo placeat explicabo, adipisci temporibus
            voluptatibus blanditiis vel voluptate aspernatur quasi, voluptatum
            fugiat modi velit quas sit, ullam asperiores dicta hic error!
          </div>
        </div>
      </div>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  paper: {
    color: "#E4E6EB",
    marginTop: "5%",
  },

  comment: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#D5D6DB",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f50057",
      },
      "&:hover fieldset": {
        borderColor: "#f50057",
      },
    },
    "& .MuiInputBase-input": {
      color: "#D5D6DB",
    },
  },
  commentPaper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "60px",
    marginTop: "60px",
  },
}));
