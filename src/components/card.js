export function createCard(cardData, deleteCard, likeCard, openImageModal) {
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

  cardImage.addEventListener('click', () => {
    openImageModal(cardData);
  });

  deleteButton.addEventListener('click', () => {
    deleteCard(cardRoot);
  });

  likeButton.addEventListener('click', () => {
    likeCard(likeButton);
  });

  return cardRoot;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}
