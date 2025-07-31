// Basic slider navigation setup
let nextBtn = document.querySelector('.next');
let prevBtn = document.querySelector('.prev');
let slider = document.querySelector('.slider');
let sliderList = slider.querySelector('.slider .list');
let thumbnail = document.querySelector('.slider .thumbnail');
let thumbnailItems = thumbnail.querySelectorAll('.dot');

thumbnail.appendChild(thumbnailItems[0]);

// Button click handlers
nextBtn.onclick = function () {
  moveSlider('next');
};

prevBtn.onclick = function () {
  moveSlider('prev');
};

// Slider move logic
function moveSlider(direction) {
  let sliderItems = sliderList.querySelectorAll('.dot');
  let thumbnailItems = document.querySelectorAll('.thumbnail .dot');

  if (direction === 'next') {
    sliderList.appendChild(sliderItems[0]);
    thumbnail.appendChild(thumbnailItems[0]);
    slider.classList.add('next');
  } else {
    sliderList.prepend(sliderItems[sliderItems.length - 1]);
    thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
    slider.classList.add('prev');
  }

  slider.addEventListener(
    'animationend',
    function () {
      if (direction === 'next') {
        slider.classList.remove('next');
      } else {
        slider.classList.remove('prev');
      }
    },
    { once: true }
  );
}

// Movie search and modal functionality
  let movies = [];

async function fetchMovies() {
  try {
    const [res1, res2] = await Promise.all([
      fetch('/auth/data/movies.json'),
      fetch('/movies2.json')
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    movies = [...data1, ...data2]; // Combine both files
  } catch (error) {
    console.error('Error loading movie data:', error);
  }
}

function renderMovies(filteredMovies) {
  const container = document.getElementById('movieList');
  container.innerHTML = '';

  filteredMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const title = movie.original_title || 'No Title';
    const genre = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || 'N/A';
    const year = movie.release_year || 'N/A';
    const rating = movie.vote_average || 0;
    const overview = typeof movie.overview === 'string' ? movie.overview : 'No overview available.';

    const stars = Math.round(rating) / 2;
    let starHtml = '';
    for (let i = 1; i <= 5; i++) {
      starHtml += `<span class="stars" style="color: ${i <= stars ? '#facc15' : '#ccc'};">★</span>`;
    }

    card.innerHTML = `
      <div class="movie-placeholder">${title}</div>
      <div class="movie-content">
        <h3 class="movie-title">${title}</h3>
        <p class="movie-meta"><strong>Genre:</strong> ${genre}</p>
        <p class="movie-meta"><strong>Year:</strong> ${year}</p>
        <p class="movie-meta"><strong>Rating:</strong> ${rating} ${starHtml}</p>
        <p class="movie-overview">${overview.substring(0, 150)}...</p>
      </div>
    `;

    card.addEventListener('click', () => showModal(movie));
    container.appendChild(card);
  });
}

function showModal(movie) {
  document.getElementById('modalPoster').textContent = movie.original_title || 'Poster';
  document.getElementById('modalTitle').textContent = movie.original_title || 'N/A';
  document.getElementById('modalImdbId').textContent = movie.imdb_id || 'N/A';
  document.getElementById('modalGenres').textContent = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || 'N/A';
  document.getElementById('modalReleaseYear').textContent = movie.release_year || 'N/A';
  document.getElementById('modalRating').textContent = movie.vote_average || 'N/A';
  document.getElementById('modalDirector').textContent = movie.director || 'N/A';
  document.getElementById('modalCast').textContent = movie.cast || 'N/A';
  document.getElementById('modalRuntime').textContent = movie.runtime || 'N/A';
  document.getElementById('modalTagline').textContent = movie.tagline || 'N/A';
  document.getElementById('modalKeywords').textContent = movie.keywords || 'N/A';
  document.getElementById('modalProduction').textContent = movie.production_companies || 'N/A';
  document.getElementById('modalOverview').textContent = movie.overview || 'N/A';
  const homepage = document.getElementById('modalHomepage');
  homepage.href = movie.homepage || '#';
  homepage.textContent = movie.homepage || 'N/A';
  document.getElementById('movieModal').style.display = 'flex';
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('movieModal').style.display = 'none';
});

document.getElementById('searchInput').addEventListener('input', () => {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const filtered = movies.filter(movie =>
    String(movie.original_title || '').toLowerCase().includes(term)
  );
  renderMovies(term ? filtered : []);
});

fetchMovies();

/* this below search bar */

const genresToDisplay = ['Action', 'Thriller', 'Crime', 'Comedy', 'Adventure', 'Science Fiction', 'Drama','Horror'];
    let moviesByGenre = {};

   async function fetchMovies1() {
    const [movies1, movies2] = await Promise.all([
      fetch('/auth/data/movies.json').then(res => res.json()),
      fetch('/movies2.json').then(res => res.json())
    ]);

    const allMovies = [...movies1, ...movies2];

    genresToDisplay.forEach(genre => {
     moviesByGenre[genre] = allMovies.filter(m => {
  let genreField = m.genres;

  if (Array.isArray(genreField)) {
    genreField = genreField.map(g => g.toLowerCase());
    return genreField.includes(genre.toLowerCase());
  } else if (typeof genreField === 'string') {
    return genreField.toLowerCase().includes(genre.toLowerCase());
  }

  return false;
});


    });

    renderGenres();
  }

  function renderGenres() {
    const container = document.getElementById('genreSections');
    container.innerHTML = '';

    genresToDisplay.forEach(genre => {
      const genreSection = document.createElement('div');
      genreSection.className = 'genre-section';

      const header = document.createElement('div');
      header.className = 'genre-header';
      header.innerHTML = `<h2>${genre}</h2>`;

      const sliderWrapper = document.createElement('div');
      sliderWrapper.className = 'slider-wrapper';

      const leftArrow = document.createElement('button');
      leftArrow.className = 'arrow-btn arrow-left';
      leftArrow.innerHTML = '&#8249;';
      leftArrow.onclick = () => scrollGenre(genre, -1);

      const rightArrow = document.createElement('button');
      rightArrow.className = 'arrow-btn arrow-right';
      rightArrow.innerHTML = '&#8250;';
      rightArrow.onclick = () => scrollGenre(genre, 1);

      const movieContainer = document.createElement('div');
      movieContainer.className = 'movie-container';
      movieContainer.id = `container-${genre}`;

      const movies = moviesByGenre[genre].slice(0, 10);
      movies.forEach(movie => {
        const rating = parseFloat(movie.vote_average || 0);
        const fullStars = Math.floor(rating / 2);
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
          starsHtml += `<span class="stars ${i < fullStars ? '' : 'inactive'}">★</span>`;
        }

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
          <div class="movie-poster">${movie.original_title || 'Poster'}</div>
          <div class="movie-info">
            <div class="movie-title">${movie.original_title || 'No Title'}</div>
            <div class="movie-meta"><strong>Genre:</strong> ${movie.genres || 'N/A'}</div>
            <div class="movie-meta"><strong>Year:</strong> ${movie.release_year || 'N/A'}</div>
            <div class="movie-meta"><strong>Rating:</strong> ${rating}${starsHtml}</div>
            <div class="movie-overview">${(movie.overview || 'No overview available.').substring(0, 100)}...</div>
          </div>
        `;
        movieContainer.appendChild(card);
      });

      sliderWrapper.appendChild(leftArrow);
      sliderWrapper.appendChild(movieContainer);
      sliderWrapper.appendChild(rightArrow);

      genreSection.appendChild(header);
      genreSection.appendChild(sliderWrapper);
      container.appendChild(genreSection);
    });
  }

  function scrollGenre(genre, direction) {
    const container = document.getElementById(`container-${genre}`);
    const scrollAmount = 270; // approx width + margin
    container.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth'
    });
  }

  fetchMovies1();


/* responsive navbar code */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navContainer = document.querySelector('.container');
    hamburger.addEventListener('click', () => {
        navContainer.classList.toggle('active');
    });
});