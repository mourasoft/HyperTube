import { Container, makeStyles, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { Comments, Cast, Synopsys, HeadMovie } from "../components/index";
import { host } from "../constants/config";
import { AuthContext } from "../context/context";

const Movie = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [quality, setQuality] = useState([]);
  const [sug, setSug] = useState();
  const history = useHistory();
  const [url, setUrl] = useState("");
  const {
    auth: { token },
  } = useContext(AuthContext);
  const creatUrl = (el) => {
    const { id, imdb_code } = movie;
    let url = `${host}/stream/${token}/${id}/${imdb_code}/${el.hash}`;
    setUrl(url);
  };

  const handleQuality = async (torrents) => {
    const HD = await torrents.find((el) => {
      return el.quality === "720p";
    });
    const QHD = await torrents.find((el) => {
      return el.quality === "1080p";
    });
    const D = await torrents.find((el) => {
      return el.quality === "3D";
    });
    const HDR = await torrents.find((el) => {
      return el.quality === "2160p";
    });

    await setQuality([HD, QHD, D, HDR]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isNaN(id)) {
      /*
       * redirect to Library
       */

      history.replace("/");
    } else {
      /*
       * Get Data
       */
      try {
        axios
          .get(
            `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
          )
          .then(async (res) => {
            const { data } = res;

            if (data && data.data.movie.imdb_code !== "tt") {
              const { movie } = data.data;
              await setMovie(movie);
              axios
                .get(
                  `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${id}`
                )
                .then((res) => {
                  const { movies } = res.data.data;
                  setSug(movies);
                });
              await handleQuality(movie.torrents);
            } else {
              history.replace("/");
            }
          });
      } catch (e) {}
    }
    return () => {
      setUrl("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const filterd = quality.filter((el) => el);

  useEffect(() => {
    if (movie) {
      document.title = `${movie?.title_long}`;
    }
  }, [movie]);
  return (
    <>
      {/* <HeaderContainer /> */}
      <Container maxWidth="lg">
        <div className={classes.paper}>
          <HeadMovie movie={movie} />
          <Synopsys movie={movie} />
          {/* <span style={{ color: "red" }}>{quality.HD.quality}</span> */}

          <div style={{ marginTop: "64px", marginBottom: "64px" }}>
            <ReactPlayer
              id="videostream"
              controls
              width="100%"
              height="auto"
              url={url}
              // light={movie?.large_cover_image}

              config={{
                file: {
                  tracks: [
                    {
                      kind: "en",
                      src: "subs/subtitles.en.vtt",
                      srcLang: "ar",
                      default: true,
                    },
                    {
                      kind: "fr",
                      src: "subs/subtitles.ja.vtt",
                      srcLang: "ar",
                    },
                    {
                      kind: "ar",
                      src: "subs/subtitles.de.vtt",
                      srcLang: "ar",
                    },
                  ],
                },
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <Button color="secondary" variant="contained">
              {quality.HD.quality}
            </Button>
            <Button color="secondary" variant="outlined">
              {quality.FHD.quality}
            </Button> */}

            {filterd.map((el, i) => (
              // <span key={i}>{el.quality}</span>
              <Button
                onClick={() => creatUrl(el)}
                style={{ margin: "5px" }}
                key={i}
                color="secondary"
                variant="outlined"
              >
                {el.quality === "2160p" ? "4K" : el.quality}
              </Button>
            ))}
          </div>
          <Cast movie={movie} sug={sug} />
          <Comments id={id} />
        </div>
      </Container>
    </>
  );
};

export default Movie;

const useStyles = makeStyles((theme) => ({
  paper: {
    color: "#E4E6EB",
    marginTop: "5%",
  },
}));
