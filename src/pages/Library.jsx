import { Container } from "@material-ui/core";
import { useState, useEffect } from "react";

import { Search, Thumbnails } from "../components/index";
// import  from "../components/Thumbnails";
import axios from "axios";
import { HeaderContainer } from "../containers/header";
import { FooterContainer } from "../containers/footer";

const Library = () => {
  const [num, setNum] = useState({
    rating: 0,
    sorted: "download_count",
    genre: "",
    order: "desc",
    search: "",
  });
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(2);
  const [movieCount, setMovieCount] = useState(0);
  const [load, setload] = useState(false);

  window.onscroll = function () {
    let totalPageHeight = document.body.scrollHeight;
    let scrollPoint = window.scrollY + window.innerHeight;
    // check if we hit the bottom of the page
    if (scrollPoint >= totalPageHeight) {
      if (!load) {
        getData();
      }
    }
  };
  console.log("in lib");
  const getData = () => {
    setload(true);
    if (movieCount > movies.length) {
      axios
        .get(
          `https://yts.mx/api/v2/list_movies.json?minimum_rating=${num.rating}&sort_by=${num.sorted}&genre=${num.genre}&page=${page}&order_by=${num.order}`
        )
        .then((res) => {
          setMovies((old) => [...old, ...res.data.data.movies]);
          setPage(page + 1);
          setload(false);
        })
        .catch((er) => {
          if (er) {
            axios
              .get(
                `https://yts.megaproxy.biz/api/v2/list_movies.json?minimum_rating=${num.rating}&sort_by=${num.sorted}&genre=${num.genre}&page=${page}&order_by=${num.order}`
              )
              .then((res) => {
                setMovies((old) => [...old, ...res.data.data.movies]);
                setPage(page + 1);
                setload(false);
              });
          }
        });
    }
  };
  useEffect(() => {
    axios
      .get(
        `https://yts.mx/api/v2/list_movies.json?sort_by=${num.sorted}&order_by=${num.order}`
      )
      .then((res) => {
        setMovieCount(res.data.data.movie_count);
        setMovies(res.data.data.movies);
        setload(false);
      })
      .catch((error) => {
        axios
          .get(
            `https://yts.megaproxy.biz/api/v2/list_movies.json?sort_by=${num.sorted}`
          )
          .then((res) => {
            setMovieCount(res.data.data.movie_count);
            setMovies(res.data.data.movies);
            setload(false);
          });
      });

    return () => {
      window.onscroll = null;
      // setload(false);
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.title = "HyperTube | Watch Your favorite Movie ";
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNum({ ...num, [name]: value });
  };

  return (
    <>
      <HeaderContainer />
      <Container maxWidth="lg">
        <Search
          num={num}
          handleChange={handleChange}
          setMovies={setMovies}
          setMovieCount={setMovieCount}
        />
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            margin: "10px ",
            justifyContent: "center",
          }}
        >
          {movies?.map((e, i) => {
            return <Thumbnails key={i} e={e} />;
          })}
        </div>
      </Container>
      <FooterContainer />
    </>
  );
};

export default Library;
