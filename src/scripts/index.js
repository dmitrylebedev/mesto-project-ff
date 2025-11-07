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

  function validateName(showEmptyError = false) {
    const value = nameInput.value.trim();

    if (value.length === 0) {
      if (showEmptyError) {
        showError(nameError, nameInput, 'Вы пропустили это поле.');
      } else {
        hideError(nameError, nameInput);
      }
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

  function validateDescription(showEmptyError = false) {
    const value = descriptionInput.value.trim();

    if (value.length === 0) {
      if (showEmptyError) {
        showError(descriptionError, descriptionInput, 'Вы пропустили это поле.');
      } else {
        hideError(descriptionError, descriptionInput);
      }
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

  function checkFormValidity(showEmptyErrors = false) {
    const isNameValid = validateName(showEmptyErrors);
    const isDescriptionValid = validateDescription(showEmptyErrors);
    const isFormValid = isNameValid && isDescriptionValid;

    submitButton.disabled = !isFormValid;
    return isFormValid;
  }

  function clearValidationErrors() {
    hideError(nameError, nameInput);
    hideError(descriptionError, descriptionInput);
    checkFormValidity(false);
  }

  nameInput.addEventListener('input', () => {
    const isNameValid = validateName(true);
    const isDescriptionValid = validateDescription(false);
    submitButton.disabled = !(isNameValid && isDescriptionValid);
  });

  nameInput.addEventListener('blur', () => {
    const isNameValid = validateName(true);
    const isDescriptionValid = validateDescription(false);
    submitButton.disabled = !(isNameValid && isDescriptionValid);
  });

  descriptionInput.addEventListener('input', () => {
    const isNameValid = validateName(false);
    const isDescriptionValid = validateDescription(true);
    submitButton.disabled = !(isNameValid && isDescriptionValid);
  });

  descriptionInput.addEventListener('blur', () => {
    const isNameValid = validateName(false);
    const isDescriptionValid = validateDescription(true);
    submitButton.disabled = !(isNameValid && isDescriptionValid);
  });

  editProfileButton.addEventListener('click', () => {
    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;
    clearValidationErrors();
    openModal(editProfileModal);
  });

  const cardNameInput = addCardForm.elements['place-name'];
  const linkInput = addCardForm.elements.link;
  const addCardSubmitButton = addCardForm.querySelector('.popup__button');
  const cardNameError = addCardForm.querySelector('.popup__error_type_card-name');
  const linkError = addCardForm.querySelector('.popup__error_type_url');

  const cardNamePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  function validateCardName(showEmptyError = false) {
    const value = cardNameInput.value.trim();

    if (value.length === 0) {
      if (showEmptyError) {
        showError(cardNameError, cardNameInput, 'Вы пропустили это поле.');
      } else {
        hideError(cardNameError, cardNameInput);
      }
      return false;
    }

    if (value.length < 2 || value.length > 30) {
      showError(cardNameError, cardNameInput, 'Должно быть от 2 до 30 символов');
      return false;
    }

    if (!cardNamePattern.test(value)) {
      showError(cardNameError, cardNameInput, 'Может содержать только латиницу, кириллицу, дефис и пробелы');
      return false;
    }

    hideError(cardNameError, cardNameInput);
    return true;
  }

  function validateLink(showEmptyError = false) {
    const value = linkInput.value.trim();

    if (value.length === 0) {
      if (showEmptyError) {
        showError(linkError, linkInput, 'Вы пропустили это поле.');
      } else {
        hideError(linkError, linkInput);
      }
      return false;
    }

    if (!linkInput.validity.valid) {
      showError(linkError, linkInput, 'Введите адрес сайта.');
      return false;
    }

    hideError(linkError, linkInput);
    return true;
  }

  function checkAddCardFormValidity(showEmptyErrors = false) {
    const isCardNameValid = validateCardName(showEmptyErrors);
    const isLinkValid = validateLink(showEmptyErrors);
    const isFormValid = isCardNameValid && isLinkValid;

    addCardSubmitButton.disabled = !isFormValid;
    return isFormValid;
  }

  function clearAddCardValidationErrors() {
    hideError(cardNameError, cardNameInput);
    hideError(linkError, linkInput);
    addCardSubmitButton.disabled = true;
  }

  cardNameInput.addEventListener('input', () => {
    const isCardNameValid = validateCardName(true);
    const isLinkValid = validateLink(false);
    addCardSubmitButton.disabled = !(isCardNameValid && isLinkValid);
  });

  cardNameInput.addEventListener('blur', () => {
    const isCardNameValid = validateCardName(true);
    const isLinkValid = validateLink(false);
    addCardSubmitButton.disabled = !(isCardNameValid && isLinkValid);
  });

  linkInput.addEventListener('input', () => {
    const isCardNameValid = validateCardName(false);
    const isLinkValid = validateLink(true);
    addCardSubmitButton.disabled = !(isCardNameValid && isLinkValid);
  });

  linkInput.addEventListener('blur', () => {
    const isCardNameValid = validateCardName(false);
    const isLinkValid = validateLink(true);
    addCardSubmitButton.disabled = !(isCardNameValid && isLinkValid);
  });

  addCardButton.addEventListener('click', () => {
    clearAddCardValidationErrors();
    openModal(addCardModal);
  });

  editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidity(true)) {
      return;
    }

    profileTitle.textContent = nameInput.value.trim();
    profileDescription.textContent = descriptionInput.value.trim();

    closeModal(editProfileModal);
  });

  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkAddCardFormValidity(true)) {
      return;
    }

    const newCardData = {
      name: cardNameInput.value.trim(),
      link: linkInput.value.trim()
    };

    const cardElement = createCard(newCardData, deleteCard, likeCard, openImageModal);
    placesList.prepend(cardElement);

    addCardForm.reset();
    clearAddCardValidationErrors();
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
