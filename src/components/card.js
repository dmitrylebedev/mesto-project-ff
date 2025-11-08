export function createCard(cardData, userId, handleDeleteClick, handleLikeClick, openImageModal) {
  const cardTemplate = document.querySelector('#card-template');
  const fragment = cardTemplate.content.cloneNode(true);
  const cardRoot = fragment.querySelector('.card');

  const cardImage = cardRoot.querySelector('.card__image');
  const cardTitle = cardRoot.querySelector('.card__title');
  const deleteButton = cardRoot.querySelector('.card__delete-button');
  const likeButton = cardRoot.querySelector('.card__like-button');
  const likeCount = cardRoot.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Отображаем количество лайков
  if (likeCount && cardData.likes) {
    likeCount.textContent = cardData.likes.length;
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes && cardData.likes.some(like => like._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }

  // Скрываем кнопку удаления, если карточка создана не текущим пользователем
  if (deleteButton) {
    const isOwner = cardData.owner && cardData.owner._id === userId;
    if (isOwner) {
      deleteButton.style.display = 'block';
      deleteButton.addEventListener('click', () => {
        handleDeleteClick(cardData._id, cardRoot);
      });
    } else {
      deleteButton.style.display = 'none';
    }
  }

  cardImage.addEventListener('click', () => {
    openImageModal(cardData);
  });

  likeButton.addEventListener('click', () => {
    handleLikeClick(cardData._id, likeButton, likeCount, isLiked);
  });

  return cardRoot;
}
