export interface IMovieDetails {
  countries: string[];
  description: string;
  directors: string[];
  genres: string[];
  imdb_id: string;
  imdb_rating: string;
  language: string[];
  popularity: string;
  rated: string;
  release_date: string;
  runtime: number;
  stars: string[];
  status: string;
  status_message: string;
  title: string;
  vote_count: string;
  year: string;
  youtube_trailer_key: string;
}

export interface IMovieTitles {
  imdb_id: string;
  title: string;
  year: number;
}