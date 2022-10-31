import axios from 'axios';
import $ from 'jquery';

const theMovieDBInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjFmYWRhMTg3ZjI4M2JmNjkwNzM3NGMxMjlhNWFhYyIsInN1YiI6IjYzNWQ3OWM3MWI3Mjk0MDA5NDg4M2VhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9MfHT9wY4czam0fzcOkmU4Wwx6VMPdQFuLWAS-xNVis',
    'Content-Type': 'application/json;charset=utf-8',
  },
});

const getMovie = async (url, type) => {
  const response = await theMovieDBInstance.get(url);
  const data = response.data.results[0];
  await renderNowPlayingMovie(data);
  await getSimilarMovies(data.id, type);
};

const getSimilarMovies = async (id, type) => {
  let url;
  url = `/movie/${id}/similar?language=en-US&page=1`;

  if (type === 'tv') {
    url = `/tv/${id}/similar?language=en-US&page=1`;
  }

  const response = await theMovieDBInstance.get(url);
  const data = response.data.results;
  await renderSimilarMovies(data);
};

const renderNowPlayingMovie = (movie) => {
  const imgBackdropElement = document.querySelector('.image-backdrop');
  imgBackdropElement.innerHTML = `
      <img
        class="w-full h-[100vh] object-cover"
        src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}"
        alt="12"
      />
  `;

  const movieElement = document.querySelector('.now-playing');
  movieElement.innerHTML = '';
  movieElement.innerHTML = `
      <div class="pl-[10px] md:pl-[300px]">
        <h1 class="text-3xl md:text-5xl font-bold">${movie.title ?? movie.original_name}</h1>
        <div class="my-4">
          <button class="border bg-gray-300 text-black border-gray-300 py-2 px-5">
            Play
          </button>
        </div>
        <p class="text-gray-400 text-sm">
          Released: ${showFormattedDate(movie.release_date ?? movie.first_air_date)}
        </p>
        <p class="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
          ${movie.overview}
        </p>
      </div>
  `;
};

const renderSimilarMovies = (movies) => {
  const similarMoviesElement = document.querySelector('.similar-movies');
  similarMoviesElement.innerHTML = '';

  movies.slice(0, 10).forEach((movie) => {
    similarMoviesElement.innerHTML += `
        <div class="cursor-pointer group-hover:scale-95 hover:!scale-100">
          <img
            alt=""
            class="w-36 rounded-sm"
            src="https://image.tmdb.org/t/p/original/${movie.poster_path}"
          />
          <p class="py-2 text-gray-400 tracking-wide text-sm font-semibold">${movie.title ?? movie.original_name}</p>
        </div>
    `;
  });
};

const showFormattedDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-EN', options);
};

document.addEventListener('DOMContentLoaded', () => {
  const urlDef = '/movie/now_playing?language=en-US';
  getMovie(urlDef);

  $('.type-movies').on('click', function () {
    const type = $(this).data('type');
    let url;
    url = '/trending/all/day';

    if (type === 'movie') {
      url = '/movie/now_playing?language=en-US';
    }

    if (type === 'tv') {
      url = '/tv/on_the_air?language=en-US&page=1';
    }

    getMovie(url, type);
  });
});
