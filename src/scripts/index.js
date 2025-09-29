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

  editProfileButton.addEventListener('click', () => {
    editProfileForm.elements.name.value = profileTitle.textContent;
    editProfileForm.elements.description.value = profileDescription.textContent;
    openModal(editProfileModal);
  });

  addCardButton.addEventListener('click', () => {
    openModal(addCardModal);
  });

  editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const nameInput = editProfileForm.elements.name;
    const descriptionInput = editProfileForm.elements.description;

    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = descriptionInput.value;

    closeModal(editProfileModal);
  });

  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const nameInput = addCardForm.elements['place-name'];
    const linkInput = addCardForm.elements.link;

    const newCardData = {
      name: nameInput.value,
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
