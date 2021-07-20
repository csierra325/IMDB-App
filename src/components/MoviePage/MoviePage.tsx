import React, { useState } from 'react';
import { IMovieDetails, IMovieTitles } from '../../Interfaces';
import './MoviePage.css';
import sleepingCat from '../../images/sleepyCat.gif';
import placeholder from '../../images/placeholder.png';
import star from '../../images/star.png';
import film from '../../images/filmWhite.png';

const MoviePage: React.FC = () => {
  const [movieTitles, setMovieTitles] = useState<IMovieTitles[]>([]);
  const [movieDetails, setMovieDetails] = useState<Partial<IMovieDetails>>({});
  const [movieImage, setMovieImage] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input.toLowerCase());
  }

  const getMovieTitles = async () => {
    setLoading(true);
    setClicked(false);
    setErrorMessage('');
    setMovieDetails({});
    await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-by-title&title=${userInput}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }
    })
      .then(res => res.json())
      .then((data) => {
        const newArr = data.movie_results.map((res: string[]) => {
          return res;
        })
        setMovieTitles(newArr);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('We cannot process your request at this time')
      })
      .finally(() => {
        setLoading(false);
      })
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
      .catch(err => {
        console.error(err);
        setErrorMessage('We cannot process your request at this time')
      });

    await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-images-by-imdb&imdb=${titleId}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY as string,
        "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST as string,
      }
    })
      .then(res => res.json())
      .then((data) => {
        setMovieImage(data.poster);
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
          <div className="title">Movie Mania<span><img className="filmIcon" src={film} alt="film icon" /></span></div>
          {!clicked &&
            <>
              <div className="subtitle">Search Your Movie Below</div>
              <div className="search-container">
                <input
                  type="text"
                  onChange={handleInput}
                  value={userInput}
                />
                <button className="btn" disabled={loading} onClick={getMovieTitles}>Submit</button>
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
        {clicked && <div className="btn back" onClick={getMovieTitles}> Back To Titles</div>}
        {clicked && movieDetails.title &&
          <>
            <div className="result-container">
              {movieImage.length > 1 && <img className="poster" src={movieImage} alt="movie poster" />}
              {movieImage.length < 1 && <img className="poster" src={placeholder} alt="movie poster" />}
              <div className="result-details">
                <div className="detail-unborder"><span className="result-title">Title:</span> {movieDetails.title}</div>
                <div className="detail"><span className="result-title">Year: </span>{movieDetails.year}</div>
                <div className="detail-unborder"><span className="result-title">Genres: </span>{movieDetails.genres?.map((genre) => <span>{genre}, </span>)}</div>
                <div className="detail"><span className="result-title">Directors: </span>{movieDetails.directors?.map((director) => <span>{director}, </span>)}</div>
                <div className="detail"><span className="result-title">Countries:</span> {movieDetails.countries?.map((country) => <span>{country}, </span>)}</div>
                <div className="detail-unborder"><span className="result-title">Lanuage:</span> {movieDetails.language?.map((language) => <span>{language}, </span>)}</div>
                <div className="detail"><span className="result-title">Release Date:</span> {movieDetails.release_date}</div>
                <div className="detail"><span className="result-title">Rated:</span> {movieDetails.rated}</div>
                <div className="detail"><span className="result-title">Vote Count:</span> {movieDetails.vote_count}</div>
                <div className="detail"><span className="result-title">IMDb Rating:</span> <img className="star" src={star} alt="star icon" />{movieDetails.imdb_rating}/10</div>
                <div className="detail"><span className="result-title">Popularity:</span> {movieDetails.popularity}</div>
              </div>
            </div>
            <div className="additional-detail">
              <div><span className="result-title">Description:</span> {movieDetails.description}</div>
              <div className="additional-title"><span className="result-title">Stars:</span> {movieDetails.stars?.map((star) => <span>{star}, </span>)}</div>
            </div>
          </>
        }
      </div>
      <div className="image-copyright">Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    </div>
  )
}

export default MoviePage;
