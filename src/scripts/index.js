import { createCard } from '../components/card.js';
import { openModal, closeModal, openImageModal, setupModalCloseHandlers } from '../components/modal.js';
import { enableValidation, clearValidation, checkFormValidityOnSubmit } from './validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, deleteCard, likeCard, unlikeCard, updateAvatar } from './api.js';

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
  const editAvatarButton = document.querySelector('.profile__image-edit-button');
  const editProfileModal = document.querySelector('.popup_type_edit');
  const addCardModal = document.querySelector('.popup_type_new-card');
  const imageModal = document.querySelector('.popup_type_image');
  const deleteCardModal = document.querySelector('.popup_type_delete-card');
  const editAvatarModal = document.querySelector('.popup_type_edit-avatar');

  const editProfileForm = document.querySelector('form[name="edit-profile"]');
  const addCardForm = document.querySelector('form[name="new-place"]');
  const editAvatarForm = document.querySelector('form[name="edit-avatar"]');

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

  // Обработчик открытия модального окна редактирования аватара
  editAvatarButton.addEventListener('click', () => {
    clearValidation(editAvatarForm, validationConfig);
    openModal(editAvatarModal);
  });

  // Обработчик отправки формы редактирования профиля
  editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(editProfileForm)) {
      return;
    }

    const submitButton = editProfileForm.querySelector(validationConfig.submitButtonSelector);
    const originalButtonText = submitButton.textContent;

    const nameInput = editProfileForm.elements.name;
    const descriptionInput = editProfileForm.elements.description;

    const name = nameInput.value.trim();
    const about = descriptionInput.value.trim();

    // Показываем состояние загрузки
    submitButton.textContent = 'Сохранение...';
    submitButton.disabled = true;

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
      })
      .finally(() => {
        // Возвращаем оригинальный текст кнопки
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  });

  // Обработчик отправки формы добавления карточки
  addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(addCardForm)) {
      return;
    }

    const submitButton = addCardForm.querySelector(validationConfig.submitButtonSelector);
    const originalButtonText = submitButton.textContent;

    const nameInput = addCardForm.elements['place-name'];
    const linkInput = addCardForm.elements.link;

    const name = nameInput.value.trim();
    const link = linkInput.value.trim();

    // Показываем состояние загрузки
    submitButton.textContent = 'Сохранение...';
    submitButton.disabled = true;

    // Отправляем новую карточку на сервер
    addCard(name, link)
      .then((cardData) => {
        // Добавляем карточку на страницу после успешного ответа
        const cardElement = createCard(cardData, currentUserId, handleDeleteClick, handleLikeClick, openImageModal);
        placesList.prepend(cardElement);

        addCardForm.reset();
        clearValidation(addCardForm, validationConfig);
        closeModal(addCardModal);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // Возвращаем оригинальный текст кнопки
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  });

  // Обработчик отправки формы редактирования аватара
  editAvatarForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (!checkFormValidityOnSubmit(editAvatarForm)) {
      return;
    }

    const submitButton = editAvatarForm.querySelector(validationConfig.submitButtonSelector);
    const originalButtonText = submitButton.textContent;

    const avatarInput = editAvatarForm.elements.avatar;
    const avatar = avatarInput.value.trim();

    // Показываем состояние загрузки
    submitButton.textContent = 'Сохранение...';
    submitButton.disabled = true;

    // Отправляем обновлённый аватар на сервер
    updateAvatar(avatar)
      .then((userData) => {
        // Обновляем аватар на странице после успешного ответа
        profileImage.style.backgroundImage = `url('${userData.avatar}')`;
        closeModal(editAvatarModal);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // Возвращаем оригинальный текст кнопки
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
  });

  // Обработчик клика по кнопке удаления карточки
  function handleDeleteClick(cardId, cardElement) {
    currentCardToDelete = cardId;
    currentCardElement = cardElement;
    openModal(deleteCardModal);
  }

  // Обработчик клика по кнопке лайка
  function handleLikeClick(cardId, likeButton, likeCount, isLiked) {
    const likePromise = isLiked ? unlikeCard(cardId) : likeCard(cardId);
    
    likePromise
      .then((updatedCard) => {
        // Обновляем состояние кнопки лайка
        if (updatedCard.likes.some(like => like._id === currentUserId)) {
          likeButton.classList.add('card__like-button_is-active');
        } else {
          likeButton.classList.remove('card__like-button_is-active');
        }
        
        // Обновляем счётчик лайков из ответа сервера
        if (likeCount && updatedCard.likes) {
          likeCount.textContent = updatedCard.likes.length;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Обработчик подтверждения удаления карточки
  const confirmDeleteButton = deleteCardModal.querySelector('.popup__button_type_confirm');
  confirmDeleteButton.addEventListener('click', () => {
    if (currentCardToDelete) {
      const originalButtonText = confirmDeleteButton.textContent;
      
      // Показываем состояние загрузки
      confirmDeleteButton.textContent = 'Удаление...';
      confirmDeleteButton.disabled = true;
      
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
        })
        .finally(() => {
          // Возвращаем оригинальный текст кнопки
          confirmDeleteButton.textContent = originalButtonText;
          confirmDeleteButton.disabled = false;
        });
    }
  });

  function renderCards(cards, userId) {
    cards.forEach(cardData => {
      const cardElement = createCard(cardData, userId, handleDeleteClick, handleLikeClick, openImageModal);
      placesList.appendChild(cardElement);
    });
  }

  setupModalCloseHandlers(editProfileModal);
  setupModalCloseHandlers(addCardModal);
  setupModalCloseHandlers(imageModal);
  setupModalCloseHandlers(deleteCardModal);
  setupModalCloseHandlers(editAvatarModal);

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
