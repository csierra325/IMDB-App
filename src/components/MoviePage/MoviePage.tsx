import React, { useState } from 'react';
import { IMovieDetails, IMovieTitles } from '../../Interfaces';
import './MoviePage.css';
import sleepingCat from '../../images/sleepyCat.gif';

const MoviePage: React.FC = () => {
  const [movieTitles, setMovieTitles] = useState<IMovieTitles[]>([]);
  const [movieDetails, setMovieDetails] = useState<Partial<IMovieDetails>>({});
  const [movieImage, setMovieImage] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input.toLowerCase());
  }

  const getMovieInfo = async () => {
    setClicked(false);
    setErrorMessage('');
    setMovieDetails({});
    await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-by-title&title=${userInput}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        const newArr = data.movie_results.map((res: string[]) => {
          return res
        })
        setMovieTitles(newArr);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('We cannot process your request at this time')
      });
  }

  const getMovieDetails = async (titleId: string) => {
    setClicked(true);
    await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movie-details&imdb=${titleId}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }

    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setMovieDetails(data);
      })
      .then(() => {
        fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-images-by-imdb&imdb=${titleId}`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-key": "Iet2yU2P8pmshxLBr3hzsEtNaWs7p1rJV9vjsniNKetVL1RRb3",
            "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
          }
        })
          .then(res => res.json())
          .then((data) => {
            console.log(data.poster);
            setMovieImage(data.poster);
          })
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('We cannot process your request at this time')
      });
  }



  return (
    <div className="content-area">
      <div className="movie-container">
        <div className="movie-subcontainer">

          <div className="title">Movie Finder</div>
          {!clicked &&
            <>
              <div className="subtitle">Search Your Movie Below</div>
              <div className="search-container">
                <input
                  type="text"
                  onChange={handleInput}
                  value={userInput}
                />
                <div className="btn" onClick={getMovieInfo}>Submit</div>
              </div>
            </>
          }
          {movieTitles && !clicked && errorMessage.length < 1 && movieTitles.map((movie) => {
            return <div className="movie-title">
              <ul id={movie.imdb_id} key={movie.imdb_id} onClick={() => getMovieDetails(movie.imdb_id)}>{movie.title}</ul>
            </div>
          })}
        </div>
        {errorMessage.length > 1 && <div className="error-container">
          <div className="error-message">{errorMessage}</div>
          <img className="submitted-img" src={sleepingCat} alt="failed requests sleeping cat" />
        </div>}
        {clicked && <div className="btn back" onClick={getMovieInfo}> Back To Titles</div>}
        {clicked && movieDetails.title &&
          <>
            <div className="result-container">
              <div className="title">{movieDetails.title}</div>
              <img src={movieImage} alt="movie poster" />
              <div className="detail">Year: {movieDetails.year}</div>
              <div className="detail">Directors: {movieDetails.directors}</div>
              <div className="detail">Description: {movieDetails.description}</div>
              <div className="detail">Countries: {movieDetails.countries}</div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default MoviePage;
