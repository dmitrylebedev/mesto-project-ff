export function createCard(cardData, deleteCard, likeCard, openImageModal) {
  const cardTemplate = document.querySelector('#card-template');
  const cardElement = cardTemplate.content.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardImage.addEventListener('click', () => {
    openImageModal(cardData);
  });

  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement.querySelector('.card'));
  });

  likeButton.addEventListener('click', () => {
    likeCard(likeButton);
  });

  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}
