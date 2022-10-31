import axios from 'axios';
import $ from 'jquery';

const theMovieDBInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YjFmYWRhMTg3ZjI4M2JmNjkwNzM3NGMxMjlhNWFhYyIsInN1YiI6IjYzNWQ3OWM3MWI3Mjk0MDA5NDg4M2VhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9MfHT9wY4czam0fzcOkmU4Wwx6VMPdQFuLWAS-xNVis',
    'Content-Type': 'application/json;charset=utf-8',
  },
});

const getPopularMovieTv = async (url, type) => {
  const response = await theMovieDBInstance.get(url);
  const data = response.data.results[0];
  await getDetailMovie(data.id, type);
};

const getDetailMovie = async (id, type) => {
  let url;
  url = `/movie/${id}?language=en-US&page=1`;

  if (type === 'tv') {
    url = `/tv/${id}?language=en-US&page=1`;
  }
  const response = await theMovieDBInstance.get(url);
  const data = response.data;
  await renderDetailMovie(data);
  await getSimilarMovies(data.id, type);

}

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

const renderDetailMovie = (movie) => {
  const imgBackdropElement = document.querySelector('.image-backdrop');
  imgBackdropElement.innerHTML = `
      <img
        class="w-full h-[100vh] object-cover"
        src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}"
        alt="12"
      />
  `;

  let tags = "";
  // console.log(movie)
  movie.genres.forEach((tag) => {
    tags += `
    <div class="font-semibold px-3 text-sm">${tag.name}</div>
    `;
  })

  const movieElement = document.querySelector('.now-playing');
  movieElement.innerHTML = '';
  movieElement.innerHTML = `
      <div class="pl-[10px] md:pl-[300px]">
        <h1 class="text-3xl md:text-5xl font-bold">${movie.title ?? movie.original_name}</h1>
        <div class="flex items-center my-4">
        <div class="text-yellow-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>

        </div>
        <div class="px-3 font-bold">${movie.vote_average.toFixed(2)}</div>

          ${tags}
        </div>
        <p class="text-gray-400 text-sm">
          Released: ${showFormattedDate(movie.release_date ?? movie.first_air_date)}
        </p>
        <p class="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
          ${movie.overview}
        </p>
        <div class="flex my-4">
          <button class="flex bg-red-700 hover:bg-red-600 text-white py-2 px-5 rounded-md drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
            <span class="px-3 font-semibold">Watch Now</span>
          </button>
          <button class="flex ml-4 bg-sky-700 hover:bg-sky-600 text-white py-2 px-5 rounded-md drop-shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
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
  const urlDef = '/movie/popular?language=en-US';
  getPopularMovieTv(urlDef);

  $('.type-movies').on('click', function () {
    const type = $(this).data('type');
    let url;
    url = '/trending/all/week';

    if (type === 'movie') {
      url = '/movie/popular?language=en-US';
    }

    if (type === 'tv') {
      url = '/tv/popular?language=en-US&page=1';
    }

    getPopularMovieTv(url, type);
  });
});
