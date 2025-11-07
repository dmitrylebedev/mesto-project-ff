import { createCard, deleteCard, likeCard } from '../components/card.js';
import { openModal, closeModal, openImageModal, setupModalCloseHandlers } from '../components/modal.js';
import { initialCards } from './cards.js';

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

  const placesList = document.querySelector('.places__list');

  const nameInput = editProfileForm.elements?.name;
  const descriptionInput = editProfileForm.elements?.description;
  const submitButton = editProfileForm.querySelector('.popup__button');
  const nameError = editProfileForm.querySelector('.popup__error_type_name');
  const descriptionError = editProfileForm.querySelector('.popup__error_type_description');

  const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  function showError(errorElement, inputElement, message) {
    if (!errorElement || !inputElement) return;
    errorElement.textContent = message;
    errorElement.classList.add('popup__error_visible');
    inputElement.classList.add('popup__input_type_error');
  }

  function hideError(errorElement, inputElement) {
    if (!errorElement || !inputElement) return;
    errorElement.textContent = '';
    errorElement.classList.remove('popup__error_visible');
    inputElement.classList.remove('popup__input_type_error');
  }

  function validateName() {
    const value = nameInput.value.trim();

    if (value.length === 0) {
      hideError(nameError, nameInput);
      return false;
    }

    if (value.length < 2 || value.length > 40) {
      showError(nameError, nameInput, 'Должно быть от 2 до 40 символов');
      return false;
    }

    if (!namePattern.test(value)) {
      showError(nameError, nameInput, 'Может содержать только латиницу, кириллицу, дефис и пробелы');
      return false;
    }

    hideError(nameError, nameInput);
    return true;
  }

  function validateDescription() {
    const value = descriptionInput.value.trim();

    if (value.length === 0) {
      hideError(descriptionError, descriptionInput);
      return false;
    }

    if (value.length < 2 || value.length > 200) {
      showError(descriptionError, descriptionInput, 'Должно быть от 2 до 200 символов');
      return false;
    }

    if (!namePattern.test(value)) {
      showError(descriptionError, descriptionInput, 'Может содержать только латиницу, кириллицу, дефис и пробелы');
      return false;
    }

    hideError(descriptionError, descriptionInput);
    return true;
  }

  function checkFormValidity() {
    const isNameValid = validateName();
    const isDescriptionValid = validateDescription();
    const isFormValid = isNameValid && isDescriptionValid;

    submitButton.disabled = !isFormValid;
    return isFormValid;
  }

  function clearValidationErrors() {
    hideError(nameError);
    hideError(descriptionError);
    checkFormValidity();
  }

  nameInput.addEventListener('input', () => {
    validateName();
    checkFormValidity();
  });

  descriptionInput.addEventListener('input', () => {
    validateDescription();
    checkFormValidity();
  });

  editProfileButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    clearValidationErrors();
    openModal(editProfileModal);
  });

  addCardButton.addEventListener('click', () => {
    openModal(addCardModal);
  });

  editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidity()) {
      return;
    }

    profileTitle.textContent = nameInput.value.trim();
    profileDescription.textContent = descriptionInput.value.trim();

    closeModal(editProfileModal);
  });

  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const cardNameInput = addCardForm.elements['place-name'];
    const linkInput = addCardForm.elements.link;

    const newCardData = {
      name: cardNameInput.value,
      link: linkInput.value
    };

    const cardElement = createCard(newCardData, deleteCard, likeCard, openImageModal);
    placesList.prepend(cardElement);

    addCardForm.reset();
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

  renderCards();
}

document.addEventListener('DOMContentLoaded', initApp);
