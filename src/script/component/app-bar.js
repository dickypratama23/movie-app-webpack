class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <nav class="fixed top-0 left-0 bg-black w-full shadow bg-opacity-20 z-50">
        <div class="container m-auto flex justify-between items-center text-rose-300">
          <h1 class="pl-8 py-4 text-3xl font-bold">MovieQuery</h1>
          <ul class="hidden md:flex items-center pr-10 text-base font-semibold cursor-pointer">
            <li class="hover:text-gray-200 py-4 px-6 type-movies" data-type="movie">Movies</li>
            <li class="hover:text-gray-200 py-4 px-6 type-movies" data-type="tv">Tv Shows</li>
            <li class="hover:text-gray-200 py-4 px-6 type-movies" data-type="trending">Trending</li>
          </ul>
        </div>
      </nav>
    `;
  }
}

customElements.define('app-bar', AppBar);
