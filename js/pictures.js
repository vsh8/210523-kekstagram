'use strict';

// Keycode constants.
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;


var LIKES_MIN = 15;
var LIKES_MAX = 200;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var MIN_COMMENTS_NUMBER = 1;
var MAX_COMMENTS_NUMBER = 5;
var MAX_COMMENT_LENGTH = 2;

var PHOTOS_NUMBER = 25;


var RESIZE_MIN_VALUE = 25;
var RESIZE_MAX_VALUE = 100;
var RESIZE_STEP = 25;

var DESCRIPTION_MAX_LENGTH = 140;

var TAG_MAX_LENGTH = 20;
var TAGS_MAX_NUMBER = 5;


// Generate a random integer number.
var randInt = function (n) {
  return Math.floor(n * Math.random());
};

// Generate a random integer number from the specified range.
var randIntRange = function (min, max) {
  return Math.floor(min + (max - min) * Math.random());
};

// Get a random item from the array.
var randChoice = function (items) {
  return items[randInt(items.length)];
};


// Generate a random comment.
var generateComment = function () {
  var comment = randChoice(COMMENTS);
  var commentLength = randInt(MAX_COMMENT_LENGTH);
  for (var j = 0; j < commentLength; j++) {
    comment += ' ' + randChoice(COMMENTS);
  }
  return comment;
};

// Generate a random photo description by its number.
var generatePhotoData = function (n) {
  var comments = [];
  var commentsNumber = randIntRange(MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER + 1);
  for (var j = 0; j < commentsNumber; j++) {
    comments.push(generateComment());
  }

  return {
    url: 'photos/' + n + '.jpg',
    likes: randIntRange(LIKES_MIN, LIKES_MAX + 1),
    comments: comments
  };
};


// Render the photo by its description.
var renderPhoto = function (photo) {
  var photoTemplate = document.querySelector('#picture-template').content;
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;

  return photoElement;
};


// Add the given photos to the specified block.
var renderPhotos = function (containerBlock, photos) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < photos.length; j++) {
    fragment.appendChild(renderPhoto(photos[j]));
  }
  containerBlock.appendChild(fragment);
};


// Generate 25 photos.
var photos = [];
for (var i = 0; i < PHOTOS_NUMBER; i++) {
  photos.push(generatePhotoData(i + 1));
}

// Draw the photos.
var picturesBlock = document.querySelector('.pictures');
renderPhotos(picturesBlock, photos);


// Implement photo popup window opening and closing.
var photoPopup = document.querySelector('.gallery-overlay');
var photoPopupCloseElement = document.querySelector('.gallery-overlay-close');

var onPhotoPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhotoPopup();
  }
};

var onPhotoPopupCloseElementEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePhotoPopup();
  }
};

var openPhotoPopup = function (photoElement) {
  photoPopup.querySelector('img').setAttribute(
      'src', photoElement.querySelector('img').getAttribute('src'));
  photoPopup.querySelector('.likes-count').textContent =
    photoElement.querySelector('.picture-likes').textContent;
  photoPopup.querySelector('.comments-count').textContent =
    photoElement.querySelector('.picture-comments').textContent;

  document.addEventListener('keydown', onPhotoPopupEscPress);

  photoPopupCloseElement.addEventListener('click', closePhotoPopup);
  photoPopupCloseElement.addEventListener('keydown', onPhotoPopupCloseElementEnterPress);

  photoPopup.classList.remove('hidden');
};

var closePhotoPopup = function () {
  document.removeEventListener('keycode', onPhotoPopupEscPress);

  photoPopupCloseElement.removeEventListener('click', closePhotoPopup);
  photoPopupCloseElement.removeEventListener('keydown', onPhotoPopupCloseElementEnterPress);

  photoPopup.classList.add('hidden');
};

picturesBlock.addEventListener('click', function (evt) {
  if (evt.target.tagName.toLowerCase() === 'img') {
    openPhotoPopup(evt.target.parentElement);
    evt.preventDefault();
  }
});
picturesBlock.addEventListener('keydown', function (evt) {
  if (evt.target.tagName.toLowerCase() === 'a' && evt.keyCode === ENTER_KEYCODE) {
    openPhotoPopup(evt.target);
    evt.preventDefault();
  }
});


var uploadFileElement = document.querySelector('.upload-input');
var uploadFormElement = document.querySelector('.upload-form');
var uploadOverlayElement = document.querySelector('.upload-overlay');
var uploadInputElements = uploadOverlayElement.querySelectorAll('input, textarea');
var uploadResizeValueElement = document.querySelector('.upload-resize-controls-value');
var uploadResizeDecElement = document.querySelector('.upload-resize-controls-button-dec');
var uploadResizeIncElement = document.querySelector('.upload-resize-controls-button-inc');
var uploadEffectPreviewElement = document.querySelector('.effect-image-preview');
var uploadEffectElement = document.querySelector('.upload-effect-controls');
var uploadDescriptionElement = document.querySelector('.upload-form-description');
var uploadHashtagsElement = document.querySelector('.upload-form-hashtags');
var uploadCancelElement = document.querySelector('.upload-form-cancel');

// Close upload dialog if Esc key pressed.
var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadOverlay();
  }
};

// Prevent upload dialog closing on pressing Esc key in description input.
var onUploadDescriptionEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
};

// Decrease resize value.
var uploadResizeValueDec = function () {
  var currentValue = parseInt(uploadResizeValueElement.value, 10);
  if (currentValue > RESIZE_MIN_VALUE) {
    currentValue -= RESIZE_STEP;
    uploadResizeValueElement.value = currentValue + '%';
    resizeUploadImagePreview();
  }
};

// Increase resize value.
var uploadResizeValueInc = function () {
  var currentValue = parseInt(uploadResizeValueElement.value, 10);
  if (currentValue < RESIZE_MAX_VALUE) {
    currentValue += RESIZE_STEP;
    uploadResizeValueElement.value = currentValue + '%';
    resizeUploadImagePreview();
  }
};

// Resize upload image.
var resizeUploadImagePreview = function () {
  var resizeValue = parseInt(uploadResizeValueElement.value, 10);
  uploadEffectPreviewElement.style.transform = 'scale(' + (resizeValue / 100) + ')';
};

// Change upload image effect.
var onUploadEffectClick = function (evt) {
  if (evt.target.tagName.toLowerCase() === 'input') {
    var effect = evt.target.id.substring(7);
    uploadEffectPreviewElement.setAttribute('class', 'effect-image-preview ' + effect);
  }
};

// Validate upload image description.
var validateUploadDescription = function (evt) {
  if (evt.target.value.length > DESCRIPTION_MAX_LENGTH) {
    evt.target.setCustomValidity('Длина комментария не должна превышать 140 символов');
  } else {
    evt.target.setCustomValidity('');
  }
};

// Validate uplaod image hashtags.
var validateUploadHashtags = function (evt) {
  var tags = evt.target.value.split(/ +/);
  var usedTags = {};

  if (tags.length === 1 && tags[0] === '') {
    evt.target.setCustomValidity('');
    return;
  }

  for (var j = 0; j < tags.length; j++) {
    if (tags[j][0] !== '#') {
      evt.target.setCustomValidity('Хэш-тег должен начинаться с символа #');
      return;
    }

    if (tags[j].length > TAG_MAX_LENGTH) {
      evt.target.setCustomValidity('Максимальная длина одного хэш-тега равна 20 символов');
      return;
    }

    if (tags[j] in usedTags) {
      evt.target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      return;
    }

    usedTags[tags[j]] = true;
  }

  if (tags.length > TAGS_MAX_NUMBER) {
    evt.target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    return;
  }

  evt.target.setCustomValidity('');
};

// Mark invalid upload input.
var markInvalidInput = function (evt) {
  evt.target.classList.add('upload-message-error');
};

// Remove invalid mark on input.
var unmarkInvalidInput = function (evt) {
  evt.target.classList.remove('upload-message-error');
};

// Reset upload form on submit.
var onUploadFormSubmit = function (evt) {
  // evt.target.reset();
};

// Open upload image dialog.
var openUploadOverlay = function () {
  uploadOverlayElement.classList.remove('hidden');

  document.addEventListener('keydown', onUploadOverlayEscPress);

  uploadCancelElement.addEventListener('click', closeUploadOverlay);

  uploadDescriptionElement.addEventListener('keydown', onUploadDescriptionEscPress);

  uploadResizeDecElement.addEventListener('click', uploadResizeValueDec);
  uploadResizeIncElement.addEventListener('click', uploadResizeValueInc);

  uploadEffectElement.addEventListener('click', onUploadEffectClick);

  uploadDescriptionElement.addEventListener('input', validateUploadDescription);
  uploadHashtagsElement.addEventListener('input', validateUploadHashtags);

  for (var j = 0; j < uploadInputElements.length; j++) {
    uploadInputElements[j].addEventListener('invalid', markInvalidInput);
    uploadInputElements[j].addEventListener('input', unmarkInvalidInput);
  }

  uploadFormElement.addEventListener('submit', onUploadFormSubmit);
};

// Close upload image dialog.
var closeUploadOverlay = function () {
  uploadOverlayElement.classList.add('hidden');

  document.removeEventListener('keydown', onUploadOverlayEscPress);

  uploadCancelElement.removeEventListener('click', closeUploadOverlay);

  uploadDescriptionElement.removeEventListener('keydown', onUploadDescriptionEscPress);

  uploadResizeDecElement.removeEventListener('click', uploadResizeValueDec);
  uploadResizeIncElement.removeEventListener('click', uploadResizeValueInc);

  uploadEffectElement.removeEventListener('click', onUploadEffectClick);

  uploadDescriptionElement.removeEventListener('input', validateUploadDescription);
  uploadHashtagsElement.removeEventListener('input', validateUploadHashtags);

  for (var j = 0; j < uploadInputElements.length; j++) {
    uploadInputElements[j].removeEventListener('invalid', markInvalidInput);
    uploadInputElements[j].removeEventListener('input', unmarkInvalidInput);
  }

  uploadFormElement.removeEventListener('submit', onUploadFormSubmit);

  uploadFileElement.click();
};

var uploadFileInputElement = document.querySelector('#upload-file');
uploadFileInputElement.addEventListener('change', openUploadOverlay);
