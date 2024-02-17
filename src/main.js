import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import errorIcon from './img/error-icon.svg';
import closeIcon from './img/close_icon.svg';

const input = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const imagesList = document.querySelector('.images-list');
const loader = document.querySelector('.loader');

form.addEventListener('submit', onBtnClick);

function onBtnClick(e) {
  e.preventDefault();
  imagesList.innerHTML = '';
  showLoader();
  const value = input.value.trim();
  if (value === '') return;
  getInfo(value)
    .then(data => renderMarkup(data))
    .catch(error => console.log(error))
    .finally(() => hideLoader());
  form.reset();
}

function getInfo(value) {
  const { key, q, image_type, orientation, safesearch } = {
    key: '42394910-99d99ece52e00ce85305c6646',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
  const BASE_URL = 'https://pixabay.com/api/';
  const PARAMS = `?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}`;
  const url = BASE_URL + PARAMS;
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.log(error));
}

function renderMarkup({ hits }) {
  if (hits.length === 0) {
    iziToast.show({
      message:
        'Sorry, there are no images matching<br/> your search query. Please try again!',
      messageColor: '#fff',
      messageSize: '16',
      messageLineHeight: '24',
      backgroundColor: '#ef4040',
      progressBarColor: '#b51b1b',
      position: 'topRight',
      iconUrl: errorIcon,
      close: false,
      buttons: [
        [
          `<button type="submit" style="background-color: inherit"><img src="${closeIcon}"/></button>`,
          function (instance, toast) {
            instance.hide(
              {
                transitionOut: 'fadeOut',
              },
              toast
            );
          },
        ],
      ],
    });
    return;
  }
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class='gallery-item'><a class='gallery-link' href='${largeImageURL}'><img class='gallery-image' src='${webformatURL}' alt='${tags}'/></a>
      <div class='info-box'>
          <p>Likes <span>${likes}</span></p>
          <p>Views <span>${views}</span></p>
          <p>Comments <span>${comments}</span></p>
          <p>Downloads <span>${downloads}</span></p>
      </div></li>`
    )
    .join('');
  imagesList.innerHTML = markup;
  const lightbox = new SimpleLightbox('.images-list a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function showLoader() {
  loader.classList.remove('hidden');
}
function hideLoader() {
  loader.classList.add('hidden');
}
