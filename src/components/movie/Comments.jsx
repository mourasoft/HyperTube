import React, { useEffect, useState, useContext } from "react";
import { Avatar, makeStyles, TextField, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { getInstance, imgUrl } from "../../helpers/instance";
import { AuthContext } from "../../context/context";
import moment from "moment";

// movie/comment

/*
 * id
 * comment
 */

export default function Comments({ id }) {
  const authContext = useContext(AuthContext);
  const { token, image } = authContext.auth;
  const [comment, setcomment] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (!token) return;
    getInstance(token)
      .get(`/movie/comment/${id}`)
      .then((res) => {
        const { comments } = res.data;
        setComments(comments);
      })
      .catch((e) => {
        // console.log(e);
        setComments([]);
      });
    // return () => {
    //   // console.log("wasi unmount");
    //   return setComments("");
    // };
  }, [token, id]);

  const handleComment = (e) => {
    setcomment(e.target.value);
  };

  const send = () => {
    let data = comment.trim();
    if (data.length <= 255) {
      getInstance(token)
        .post("/movie/comment", { id, comment })
        .then((res) => {
          const { comment, created_at, username, image } = res.data.comment;
          setComments((old) => [
            {
              comment,
              created_at,
              username,
              image,
            },
            ...old,
          ]);
        });
    } else setcomment("");
    setcomment("");
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
          image={image}
        />
        {comments?.map((el, i) => {
          return <Comment classes={classes} key={i} el={el} />;
        })}
      </div>
    </div>
  );
}

function HeadComent({ classes, handleComment, send, comment, image }) {
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className={classes.userAvatar}>
        <Avatar src={`${imgUrl}${image}`} />
      </div>
      <div style={{ flexBasis: "90%" }}>
        <TextField
          className={classes.comment}
          variant="outlined"
          onChange={handleComment}
          value={comment}
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

function Comment({ classes, el: { username, comment, image, created_at } }) {
  return (
    <div>
      <div className={classes.commentPaper}>
        <div style={{ flexBasis: "5%", marginRight: "15px" }}>
          <Avatar
            className={classes.profil}
            onClick={() => window.open(`/user/${username}`)}
            src={`${imgUrl}${image}`}
            alt={username}
          />
        </div>
        <div
          style={{
            flexBasis: "90%",
          }}
        >
          <div className={classes.username}>
            <div>{username}</div>
            <div style={{ fontSize: "10px" }}>
              {moment(created_at).fromNow()}
            </div>
          </div>
          <div>{comment}</div>
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
  profil: {
    cursor: "pointer",
    "&:hover": {
      transition: "1s",
      transform: "scale(1.3)",
    },
  },
  username: {
    marginBottom: "8px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  userAvatar: {
    flexBasis: "5%",
    marginRight: "15px",
  },
  // commentPaper: { padding: "10px", display: "flex", alignItems: "flex-start" },
}));
