import {userProfile} from './user-data.js';

const userProfileElement = document.querySelector('.user-profile');
const userCryptoBalanceElement = userProfileElement.querySelector('#user-crypto-balance');
const userFiatBalanceElement = userProfileElement.querySelector('#user-fiat-balance');
const userProfileNameElement = userProfileElement.querySelector('.user-profile__name span');

export const renderUserProfile = () => {
  const {userName, balances} = userProfile;

  userProfileNameElement.textContent = userName;
  userCryptoBalanceElement.textContent = balances[0].amount;
  userFiatBalanceElement.textContent = balances[1].amount;
};


