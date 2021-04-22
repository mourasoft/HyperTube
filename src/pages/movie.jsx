import { Container, makeStyles, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import HeadMovie from "../components/HeadMovie";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ReactPlayer, { setCurrentUrl } from "react-player";
// import Synopsys from "../components/Synopsys";
// import Cast from "../components/Cast";
import { Comments, Cast, Synopsys, HeadMovie } from "../components/index";
import { HeaderContainer } from "../containers/header";
import { FooterContainer } from "../containers/footer";

const Movie = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [quality, setQuality] = useState([]);
  const [sug, setSug] = useState();
  const history = useHistory();
  const [url, setUrl] = useState("");

  // const [url, setUrl] = useState("");

  // console.log(movie);
  // console.log(url);
  const handleQuality = async (torrents) => {
    // console.log(torrents);
    const HD = await torrents.find((el) => {
      return el.quality === "720p";
    });
    const QHD = await torrents.find((el) => {
      return el.quality === "1080p";
      // return { n: "null" };
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

      history.replace("/library");
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
            // console.log(data.data);
            if (data && data.data.movie.imdb_code !== "tt") {
              const { movie } = data.data;
              axios
                .get(
                  `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${id}`
                )
                .then((res) => {
                  // console.log(res.data.data);
                  const { movies } = res.data.data;
                  setSug(movies);
                });
              await setMovie(movie);
              await handleQuality(movie.torrents);
            } else {
              /*
               * redirect to Library
               */

              history.replace("/library");
            }
          });
      } catch (e) {}
    }
  }, [id]);
  const filterd = quality.filter((el) => el);
  // useEffect(() => {
  //   console.log("filtred", filterd);
  //   if (filterd) {
  //     console.log("useffct dyal filter");
  //   }
  //   // url ={http://10.12.7.10:5000/api/v1/movie/stream/imdcode/${url}}
  // }, [filterd]);
  // console.log(filterd);
  useEffect(() => {
    if (movie) {
      console.log(movie);
      document.title = `${movie?.title_long}`;
    }
  }, [movie]);
  return (
    <>
      <HeaderContainer />
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
              // onStart={() => {
              //   setCurrentUrl(
              //     `http://10.12.7.10:5000/api/v1/movie/stream/${
              //       movie && movie?.imdb_code
              //     }/${filterd[0] && filterd[0]?.hash}`
              //   );
              // }}
              // url={`http://10.12.7.10:5000/api/v1/movie/stream/${
              //   movie && movie?.imdb_code
              // }/${filterd[0] && filterd[0]?.hash}`}
              light={movie?.large_cover_image}
              onError={(e) => {
                console.log(e);
              }}
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
      <FooterContainer />
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

// console.log("9lawi", quality);
// try {
//   axios
//     .get(
//       `https://yts.megaproxy.biz/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
//     )
//     .then((res) => {
//       console.log(res.data);
//       if (!res.data) {
//         /*
//          *
//          * no data in ipa return to library
//          */
//         console.log("no data");
//       } else {
//         console.log("data kayna");
//       }
//       // setMovie(res.data.data.movie);
//       // axios
//       //   .post(`http://10.12.7.10:5000/api/v1/movie`, {
//       //     movie: res.data.data.movie,
//       //   })
//       //   .then((res) => {
//       //     // console.log("res ===>", res);

//       //     let element = document.getElementById("videostream");
//       //     element = element.getElementsByTagName("video")[0];
//       //     element.setAttribute(
//       //       "src",
//       //       `http://10.12.7.10:5000/api/v1/movie/stream/${res.data.hash}`
//       //     );

//       //     element.load();
//       //     // setUrl(
//       //     //   `http://10.12.7.10:5000/api/v1/movie/stream/${res.data.hash}`
//       //     // );
//       //   });
//     });
// } catch (e) {}
// console.log(movie);

// const Player = (url) => {
//   return (
//     <div style={{ marginTop: "64px", marginBottom: "64px" }}>
//       <ReactPlayer
//         id="videostream"
//         controls
//         width="100%"
//         height="auto"
//         url={[
//           {
//             src: `http://10.12.7.10:5000/api/v1/movie/stream/${url}`,
//             type: "video/mp4",
//           },
//         ]}
//         onError={(e) => {
//           console.log(e);
//         }}
//         config={{
//           file: {
//             tracks: [
//               {
//                 kind: "en",
//                 src: "subs/subtitles.en.vtt",
//                 srcLang: "ar",
//                 default: true,
//               },
//               {
//                 kind: "fr",
//                 src: "subs/subtitles.ja.vtt",
//                 srcLang: "ar",
//               },
//               {
//                 kind: "ar",
//                 src: "subs/subtitles.de.vtt",
//                 srcLang: "ar",
//               },
//             ],
//           },
//         }}
//         // optio
//       />
//     </div>
//   );
// };
