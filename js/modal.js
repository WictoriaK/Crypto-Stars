import {isEscapeKey, isEnterKey} from './utils.js';

const bodyElement = document.querySelector('body');
const modalElement = document.querySelector('.modal');
const userListTableElement = document.querySelector('.users-list__table');
const closeModalBtn = modalElement.querySelector('.modal__close-btn');



const getUserData = (id) => {
  const row = document.querySelector(`tr[data-user="${id}"]`);

  if (!row) {
    return null;
  }

  const cells = row.querySelectorAll('td');

  if(cells.length < 5) {
    return null;
  }

  return {
    name: cells[0].textContent.trim(),
    exchangeRate: cells[2].textContent.trim(),
    cashlimit: cells[3].textContent.trim(),
  };
};

const setData = (userData) => {
  modalElement.querySelector('.transaction-info__item--name').textContent = userData.name;
  modalElement.querySelector('.transaction-info__item--exchangerate .transaction-info__data').textContent = userData.exchangeRate;
  modalElement.querySelector('.transaction-info__item--cashlimit .transaction-info__data').textContent = userData.cashlimit;
};

const showModal = (userData) => {
  bodyElement.classList.add('scroll-lock');
  modalElement.style.display = 'flex';

  setData(userData);

  document.addEventListener('keydown', onPopupEscKeydown);
};

const closeModal = () => {
  bodyElement.classList.remove('scroll-lock');
  modalElement.style.display = 'none';

  document.removeEventListener('keydown', onPopupEscKeydown);
};


function onPopupEscKeydown(evt) {
  if(isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

userListTableElement.addEventListener('click', (evt) => {
  const button = evt.target.closest('.sell-btn');

  if(!button) {
    return;
  }

  const userData = getUserData(button.dataset.user);

  if(!userData) {
    return;
  }

  showModal(userData);

});

userListTableElement.addEventListener('keydown', (evt) => {
  if(isEnterKey(evt)) {
    showModal();
  }
});


closeModalBtn.addEventListener('click', () => closeModal());
closeModalBtn.addEventListener('keydown', (evt) => {
  if (isEnterKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
});

