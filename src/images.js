import logoImg from './images/logo.svg';

document.addEventListener('DOMContentLoaded', () => {
  const logoElement = document.querySelector('.header__logo');
  if (logoElement) {
    logoElement.src = logoImg;
  }
});
