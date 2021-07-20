import React, { useState } from 'react';


const MoviePage: React.FC = () => {
  const [movieData, setMovieData] = useState<any>([]);
  const [movieDetails, setMovieDetals] = useState<any>({});
  const [userInput, setUserInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clicked, setClicked] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input.toLowerCase());
  }

  const getMovieInfo = async () => {
    const res = await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movies-by-title&title=${userInput}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "Iet2yU2P8pmshxLBr3hzsEtNaWs7p1rJV9vjsniNKetVL1RRb3",
        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
      }
    })
    if (!res.ok) {
      const error = await res.text();
      console.log(error);
      setErrorMessage('Im Sorry We Could Not Find That Title')
    }
    const data = await res.json();
    if (data) {
      const newArr = data.movie_results.map((res: any) => {
        return res
      })
      setMovieData(newArr);
    };
  }

  const getMovieDetails = async (value: any) => {
    setClicked(true);
    const res = await fetch(`https://movies-tvshows-data-imdb.p.rapidapi.com/?type=get-movie-details&imdb=${value.id}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "Iet2yU2P8pmshxLBr3hzsEtNaWs7p1rJV9vjsniNKetVL1RRb3",
        "x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com"
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
    <>
      <div>Welcome</div>
      <div>Please Search Your Movie Below</div>
      <input
        type="text"
        onChange={handleInput}
        value={userInput}
      />
      <div onClick={getMovieInfo}>Submit</div>
      {errorMessage.length > 1 && <div>{errorMessage}</div>}
      {movieData && !clicked && movieData.map((movie: any) => {
        return <ul id={movie.imdb_id} key={movie.imdb_id} onClick={((e) => getMovieDetails(e.target))}>{movie.title}</ul>
      })}
      {clicked &&
        <div>
          <div>Title: {movieDetails.title}</div>
          <div>Year: {movieDetails.year}</div>
          <div>Directors: {movieDetails.directors}</div>
          <div>Description: {movieDetails.description}</div>
          <div>Countries: {movieDetails.countries}</div>
          <div></div>
        </div>
      }
    </>
  )
}

export default MoviePage;
