import { createCard, deleteCard, likeCard } from '../components/card.js';
import { openModal, closeModal, openImageModal, setupModalCloseHandlers } from '../components/modal.js';
import { initialCards } from './cards.js';
import { enableValidation, clearValidation, checkFormValidityOnSubmit } from './validation.js';
import { getUserInfo } from './api.js';

// Конфигурация валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

function initApp() {
  const editProfileButton = document.querySelector('.profile__edit-button');
  const addCardButton = document.querySelector('.profile__add-button');
  const editProfileModal = document.querySelector('.popup_type_edit');
  const addCardModal = document.querySelector('.popup_type_new-card');
  const imageModal = document.querySelector('.popup_type_image');

  const editProfileForm = document.querySelector('form[name="edit-profile"]');
  const addCardForm = document.querySelector('form[name="new-place"]');

  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');
  const profileImage = document.querySelector('.profile__image');

  const placesList = document.querySelector('.places__list');

  // Включаем валидацию для всех форм
  enableValidation(validationConfig);

  // Обработчик открытия модального окна редактирования профиля
  editProfileButton.addEventListener('click', () => {
    const nameInput = editProfileForm.elements.name;
    const descriptionInput = editProfileForm.elements.description;

    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;

    clearValidation(editProfileForm, validationConfig);
    openModal(editProfileModal);
  });

  // Обработчик открытия модального окна добавления карточки
  addCardButton.addEventListener('click', () => {
    clearValidation(addCardForm, validationConfig);
    openModal(addCardModal);
  });

  // Обработчик отправки формы редактирования профиля
  editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(editProfileForm)) {
      return;
    }

    const nameInput = editProfileForm.elements.name;
    const descriptionInput = editProfileForm.elements.description;

    profileTitle.textContent = nameInput.value.trim();
    profileDescription.textContent = descriptionInput.value.trim();

    closeModal(editProfileModal);
  });

  // Обработчик отправки формы добавления карточки
  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(addCardForm)) {
      return;
    }

    const nameInput = addCardForm.elements['place-name'];
    const linkInput = addCardForm.elements.link;

    const newCardData = {
      name: nameInput.value.trim(),
      link: linkInput.value.trim()
    };

    const cardElement = createCard(newCardData, deleteCard, likeCard, openImageModal);
    placesList.prepend(cardElement);

    addCardForm.reset();
    clearValidation(addCardForm, validationConfig);
    closeModal(addCardModal);
  });

  function renderCards() {
    initialCards.forEach(cardData => {
      const cardElement = createCard(cardData, deleteCard, likeCard, openImageModal);
      placesList.appendChild(cardElement);
    });
  }

  setupModalCloseHandlers(editProfileModal);
  setupModalCloseHandlers(addCardModal);
  setupModalCloseHandlers(imageModal);

  // Загружаем информацию о пользователе с сервера
  getUserInfo()
    .then((userData) => {
      // Обновляем данные профиля
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    })
    .catch((err) => {
      console.log(err);
    });

  renderCards();
}

document.addEventListener('DOMContentLoaded', initApp);
