import './css/styles.css';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33761438-9314d2b90b41fb92b07a88ae9';
let page = 1;

  const inputForm = document.querySelector('input');
  const loadMoreBtn = document.querySelector('.load-more');
  const searchForm = document.querySelector('#search-form');
  const gallery = document.querySelector('.gallery');

  function fetchPicture(clientRequest, page) {
      return axios.get(
        `${BASE_URL}/?key=${KEY}&q=${clientRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  )
  .then(responce => {
    console.log(responce);
    return responce;
  })
  .catch(error => {
    console.log('ERROR: ' + error);
  });
};

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    const input = inputForm.value.trim();
    if (input.length !== 0) {
      page = 1;
      fetchPicture(input, page)
        .then(buildForSearch)
        .catch(error => {});
    }
  };

  function buildForSearch(images) {
    if (images.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    }
    if (images.data.totalHits !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
      const markup = images.data.hits
        .map(
          ({
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) => {
            return `
                <div class="photo-card">
                <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" width=310 height=205/></a>
                <div class="info">
                  <p class="info-item"><b>Likes</b>${likes}</p>
                  <p class="info-item"><b>Views</b>${views}</p>
                  <p class="info-item"><b>Comments</b>${comments}</p>
                  <p class="info-item"><b>Downloads</b>${downloads}</p>
                </div>
              </div>`;
          }
        )
        .join('');
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    }
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 500,
  });

