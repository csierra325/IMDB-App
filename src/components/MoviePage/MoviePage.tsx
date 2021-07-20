import React, { useState } from 'react';
import { IMovieDetails, IMovieTitles } from '../../Interfaces';
import './MoviePage.css';

const MoviePage: React.FC = () => {
  const [movieTitles, setMovieTitles] = useState<IMovieTitles[]>([]);
  const [movieDetails, setMovieDetals] = useState<Partial<IMovieDetails>>({});
  const [userInput, setUserInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input.toLowerCase());
  }

  const getMovieInfo = async () => {
    setClicked(false);
    const res = await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-by-title&title=${userInput}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }
    })
    if (!res.ok) {
      const error = await res.text();
      console.log(error);
      setErrorMessage('Im Sorry We Could Not Find That Title')
    }
    const data = await res.json();
    if (data) {
      const newArr = data.movie_results.map((res: string[]) => {
        return res
      })
      setMovieTitles(newArr);
    };
  }

  const getMovieDetails = async (titleId: string) => {
    setClicked(true);
    const res = await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movie-details&imdb=${titleId}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }
    })
    if (!res.ok) {
      const error = await res.text();
      console.log(error);
    }
    const data = await res.json();
    if (data) {
      console.log(data);
      setMovieDetals(data);
    }
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
          {movieTitles && !clicked && movieTitles.map((movie) => {
            return <div className="movie-title">
              <ul id={movie.imdb_id} key={movie.imdb_id} onClick={() => getMovieDetails(movie.imdb_id)}>{movie.title}</ul>
            </div>
          })}
        </div>

        {errorMessage.length > 1 && <div>{errorMessage}</div>}

        {clicked &&
          <>
            <div className="btn back" onClick={getMovieInfo}> Back To Titles</div>
            <div className="result-container">
              <div className="title">{movieDetails.title}</div>
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
