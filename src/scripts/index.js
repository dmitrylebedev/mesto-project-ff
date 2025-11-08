import { createCard, likeCard } from '../components/card.js';
import { openModal, closeModal, openImageModal, setupModalCloseHandlers } from '../components/modal.js';
import { enableValidation, clearValidation, checkFormValidityOnSubmit } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, deleteCard } from './api.js';

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
  const deleteCardModal = document.querySelector('.popup_type_delete-card');

  const editProfileForm = document.querySelector('form[name="edit-profile"]');
  const addCardForm = document.querySelector('form[name="new-place"]');

  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');
  const profileImage = document.querySelector('.profile__image');

  const placesList = document.querySelector('.places__list');
  let currentUserId = null;
  let currentCardToDelete = null;
  let currentCardElement = null;

  // Включаем валидацию для всех форм
  enableValidation(validationConfig);

  // Обработчик открытия модального окна редактирования профиля
  editProfileButton.addEventListener('click', () => {
    const nameInput = editProfileForm.elements.name;
    const descriptionInput = editProfileForm.elements.description;

    nameInput.value = profileTitle.textContent;
    descriptionInput.value = profileDescription.textContent;

    clearValidation(editProfileForm, validationConfig);

    // Валидируем поля после заполнения, чтобы активировать кнопку если данные валидны
    if (editProfileForm._validators) {
      editProfileForm._validators.forEach(validator => {
        validator(false);
      });
    }

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

    const name = nameInput.value.trim();
    const about = descriptionInput.value.trim();

    // Отправляем обновлённые данные на сервер
    updateUserInfo(name, about)
      .then((userData) => {
        // Обновляем данные профиля на странице после успешного ответа
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(editProfileModal);
      })
      .catch((err) => {
        console.log(err); // выводим ошибку в консоль
      });
  });

  // Обработчик отправки формы добавления карточки
  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(addCardForm)) {
      return;
    }

    const nameInput = addCardForm.elements['place-name'];
    const linkInput = addCardForm.elements.link;

    const name = nameInput.value.trim();
    const link = linkInput.value.trim();

    // Отправляем новую карточку на сервер
    addCard(name, link)
      .then((cardData) => {
        // Временная отладка (можно удалить после проверки)
        console.log('New card created:', cardData);
        console.log('Card owner ID:', cardData.owner?._id);
        console.log('Current user ID:', currentUserId);
        
        // Добавляем карточку на страницу после успешного ответа
        const cardElement = createCard(cardData, currentUserId, handleDeleteClick, likeCard, openImageModal);
        placesList.prepend(cardElement);

        addCardForm.reset();
        clearValidation(addCardForm, validationConfig);
        closeModal(addCardModal);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // Обработчик клика по кнопке удаления карточки
  function handleDeleteClick(cardId, cardElement) {
    currentCardToDelete = cardId;
    currentCardElement = cardElement;
    openModal(deleteCardModal);
  }

  // Обработчик подтверждения удаления карточки
  const confirmDeleteButton = deleteCardModal.querySelector('.popup__button_type_confirm');
  confirmDeleteButton.addEventListener('click', () => {
    if (currentCardToDelete) {
      deleteCard(currentCardToDelete)
        .then(() => {
          // Удаляем карточку со страницы после успешного ответа
          if (currentCardElement) {
            currentCardElement.remove();
          }
          closeModal(deleteCardModal);
          currentCardToDelete = null;
          currentCardElement = null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  function renderCards(cards, userId) {
    cards.forEach(cardData => {
      const cardElement = createCard(cardData, userId, handleDeleteClick, likeCard, openImageModal);
      placesList.appendChild(cardElement);
    });
  }

  setupModalCloseHandlers(editProfileModal);
  setupModalCloseHandlers(addCardModal);
  setupModalCloseHandlers(imageModal);
  setupModalCloseHandlers(deleteCardModal);

  // Загружаем информацию о пользователе и карточки с сервера одновременно
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      // Сохраняем _id пользователя для использования в других функциях
      currentUserId = userData._id;

      // Обновляем данные профиля
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;

      // Отображаем карточки после получения _id пользователя
      renderCards(cards, userData._id);
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    });
}

document.addEventListener('DOMContentLoaded', initApp);
