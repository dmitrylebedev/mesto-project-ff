export function openModal(modalElement) {
  modalElement.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
}

export function closeModal(modalElement) {
  modalElement.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

export function openImageModal(cardData) {
  const imageModal = document.querySelector('.popup_type_image');
  const modalImage = imageModal.querySelector('.popup__image');
  const modalCaption = imageModal.querySelector('.popup__caption');

  modalImage.src = cardData.link;
  modalImage.alt = cardData.name;
  modalCaption.textContent = cardData.name;

  openModal(imageModal);
}
