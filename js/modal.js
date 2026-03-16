import {isEscapeKey, isEnterKey} from './utils.js';
import {modalElement, getProfileData, setStaticData} from './modal-sellers.js';
import {userProfile} from './mock/user-data.js';

const bodyElement = document.body;
const userListTableElement = document.querySelector('.users-list__table');
const closeModalBtn = modalElement.querySelector('.modal__close-btn');
const modalOverlayElement = document.querySelector('.modal__overlay');
const modalFormElement = modalElement.querySelector('.modal-buy');
const cryptoNumberElement = modalFormElement.querySelector('.custom-input__crypto-number');

let currentUserData = null;

const setCryptoNumber = () => {
  cryptoNumberElement.placeholder = userProfile?.wallet?.address;
  cryptoNumberElement.value = userProfile?.wallet?.address;
}

const clearProfileModalData = () => {
  modalFormElement.reset();
};

const showModal = (userId, userData) => {
  modalElement.dataset.userId = userId;
  setStaticData(userData);
  setCryptoNumber();

  modalElement.classList.remove('hidden');
  bodyElement.classList.add('scroll-lock');


  document.addEventListener('keydown', onPopupEscKeydown);
  modalOverlayElement.addEventListener('click', onModalOverlayClick);
};

const closeModal = () => {
  clearProfileModalData();
  bodyElement.classList.remove('scroll-lock');
  modalElement.classList.add('hidden');

  document.removeEventListener('keydown', onPopupEscKeydown);
  modalOverlayElement.removeEventListener('click', onModalOverlayClick);
};


function onPopupEscKeydown(evt) {
  if(isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
}

function onModalOverlayClick(evt) {
  if(evt.target === modalOverlayElement) {
    closeModal();
  }
}

const handleUserAction = (evt) => {
  if(evt.type === 'keydown' && !isEnterKey(evt)) {
    return;
  }

  const button = evt.target.closest('.sell-btn');

  if(!button) {
    return;
  }
  const userId = button.dataset.user;
  currentUserData = getProfileData(userId);

  if(!currentUserData) {
    return;
  }

  showModal(userId, currentUserData);
};


userListTableElement.addEventListener('click', handleUserAction);
userListTableElement.addEventListener('keydown', handleUserAction);


closeModalBtn.addEventListener('click', () => closeModal());
closeModalBtn.addEventListener('keydown', (evt) => {
  if (isEnterKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
});


export {
  currentUserData
}
