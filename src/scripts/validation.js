const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

// Функция для отображения ошибки
function showError(errorElement, inputElement, message, config) {
  if (!errorElement || !inputElement) return;
  errorElement.textContent = message;
  errorElement.classList.add(config.errorClass);
  inputElement.classList.add(config.inputErrorClass);
}

// Функция для скрытия ошибки
function hideError(errorElement, inputElement, config) {
  if (!errorElement || !inputElement) return;
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
  inputElement.classList.remove(config.inputErrorClass);
}

// Функция валидации поля с текстом (имя, описание, название карточки)
function validateTextField(input, errorElement, config, minLength, maxLength, showEmptyError = false) {
  const value = input.value.trim();
  const errorMessage = input.dataset.errorMessage || 'Вы пропустили это поле.';
  const patternError = input.dataset.patternError || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';

  if (value.length === 0) {
    if (showEmptyError) {
      showError(errorElement, input, errorMessage, config);
    } else {
      hideError(errorElement, input, config);
    }
    return false;
  }

  if (value.length < minLength || value.length > maxLength) {
    const lengthError = input.dataset.lengthError || `Должно быть от ${minLength} до ${maxLength} символов`;
    showError(errorElement, input, lengthError, config);
    return false;
  }

  if (!namePattern.test(value)) {
    showError(errorElement, input, patternError, config);
    return false;
  }

  hideError(errorElement, input, config);
  return true;
}

// Функция валидации поля URL
function validateUrlField(input, errorElement, config, showEmptyError = false) {
  const value = input.value.trim();
  const errorMessage = input.dataset.errorMessage || 'Вы пропустили это поле.';
  const urlError = input.dataset.urlError || 'Введите адрес сайта.';

  if (value.length === 0) {
    if (showEmptyError) {
      showError(errorElement, input, errorMessage, config);
    } else {
      hideError(errorElement, input, config);
    }
    return false;
  }

  if (!input.validity.valid) {
    showError(errorElement, input, urlError, config);
    return false;
  }

  hideError(errorElement, input, config);
  return true;
}

// Функция для проверки валидности всей формы
function checkFormValidity(form, config, validators, showEmptyErrors = false) {
  const submitButton = form.querySelector(config.submitButtonSelector);
  if (!submitButton) return false;

  let isFormValid = true;
  validators.forEach(validator => {
    const isValid = validator(showEmptyErrors);
    if (!isValid) {
      isFormValid = false;
    }
  });

  submitButton.disabled = !isFormValid;
  if (config.inactiveButtonClass) {
    if (isFormValid) {
      submitButton.classList.remove(config.inactiveButtonClass);
    } else {
      submitButton.classList.add(config.inactiveButtonClass);
    }
  }
  return isFormValid;
}

// Функция для очистки ошибок валидации формы
export function clearValidation(form, config) {
  const inputs = form.querySelectorAll(config.inputSelector);
  const errors = form.querySelectorAll(`.${config.errorClass}`);
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.classList.remove(config.inputErrorClass);
  });

  errors.forEach(error => {
    error.textContent = '';
    error.classList.remove(config.errorClass);
  });

  if (submitButton) {
    submitButton.disabled = true;
    if (config.inactiveButtonClass) {
      submitButton.classList.add(config.inactiveButtonClass);
    }
  }
}

// Функция для получения конфигурации полей формы
function getFieldConfigs(formName) {
  const configs = {
    'edit-profile': [
      {
        inputSelector: 'input[name="name"]',
        errorSelector: '.popup__error_type_name',
        type: 'text',
        minLength: 2,
        maxLength: 40
      },
      {
        inputSelector: 'input[name="description"]',
        errorSelector: '.popup__error_type_description',
        type: 'text',
        minLength: 2,
        maxLength: 200
      }
    ],
    'new-place': [
      {
        inputSelector: 'input[name="place-name"]',
        errorSelector: '.popup__error_type_card-name',
        type: 'text',
        minLength: 2,
        maxLength: 30
      },
      {
        inputSelector: 'input[name="link"]',
        errorSelector: '.popup__error_type_url',
        type: 'url'
      }
    ]
  };

  return configs[formName];
}

// Функция для включения валидации формы
function enableFormValidation(form, config, fieldConfigs) {
  const submitButton = form.querySelector(config.submitButtonSelector);

  if (!submitButton) return;

  // Создаем валидаторы для каждого поля
  const validators = fieldConfigs.map(fieldConfig => {
    const input = form.querySelector(fieldConfig.inputSelector);
    const errorElement = form.querySelector(fieldConfig.errorSelector);

    if (!input || !errorElement) return null;

    let validateField;
    if (fieldConfig.type === 'url') {
      validateField = (showEmptyError) => validateUrlField(input, errorElement, config, showEmptyError);
    } else {
      validateField = (showEmptyError) => validateTextField(
        input,
        errorElement,
        config,
        fieldConfig.minLength,
        fieldConfig.maxLength,
        showEmptyError
      );
    }

    input.addEventListener('input', () => {
      const currentFieldValid = validateField(true);
      const otherFieldsValid = validators
        .filter((v, idx) => v && idx !== fieldConfigs.indexOf(fieldConfig))
        .map(v => v(false));
      const allValid = currentFieldValid && otherFieldsValid.every(v => v);
      submitButton.disabled = !allValid;
      if (config.inactiveButtonClass) {
        if (allValid) {
          submitButton.classList.remove(config.inactiveButtonClass);
        } else {
          submitButton.classList.add(config.inactiveButtonClass);
        }
      }
    });

    input.addEventListener('blur', () => {
      const currentFieldValid = validateField(true);
      const otherFieldsValid = validators
        .filter((v, idx) => v && idx !== fieldConfigs.indexOf(fieldConfig))
        .map(v => v(false));
      const allValid = currentFieldValid && otherFieldsValid.every(v => v);
      submitButton.disabled = !allValid;
      if (config.inactiveButtonClass) {
        if (allValid) {
          submitButton.classList.remove(config.inactiveButtonClass);
        } else {
          submitButton.classList.add(config.inactiveButtonClass);
        }
      }
    });

    return validateField;
  }).filter(v => v !== null);

  // Сохраняем валидаторы в форме для использования при submit
  form._validators = validators;
  form._validationConfig = config;
}

// Функция для настройки обработчиков событий формы
function setEventListeners(formElement, config) {
  const formName = formElement.getAttribute('name');
  const fieldConfigs = getFieldConfigs(formName);

  if (fieldConfigs) {
    enableFormValidation(formElement, config, fieldConfigs);
  }
}

// Главная функция для включения валидации всех форм
export function enableValidation(config) {
  // Найдём все формы с указанным селектором в DOM,
  // сделаем из них массив методом Array.from
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  // Переберём полученную коллекцию
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы и конфиг
    setEventListeners(formElement, config);
  });
}

// Экспортируем функцию для проверки валидности формы при submit
export function checkFormValidityOnSubmit(form) {
  if (!form._validators || !form._validationConfig) {
    return false;
  }
  return checkFormValidity(form, form._validationConfig, form._validators, true);
}
