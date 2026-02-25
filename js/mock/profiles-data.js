import {getRandomFloatNumber, getRandomArrayElement} from '../utils.js';

const PROFILES_AMOUNT = 20;
const profileNamesArray = ['Emily', 'James', 'Sophia', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Mia', 'Lucas'];
const statusArray = ['seller', 'buyer'];


const createProfile = (index) => {
  const status = getRandomArrayElement(statusArray);

  return {
    id: index,
    balance: {
      currency: 'KEKS',
      amount: getRandomFloatNumber(1, 2000)
    },
    exchangeRate: getRandomFloatNumber(1000, 3000),
    isVerified: index % 2 === 0,
    status: status,
    userName: getRandomArrayElement(profileNamesArray),
    ...(status === 'seller' && {
      paymentMethods: [
        {
          currency: 'RUB',
          provider: 'QIWI',
          accountNumber: '0000 0000 0000 3605'
        },
        {
          currency: 'RUB',
          provider: 'Sberbank',
          accountNumber: '0000 0000 0000 9567'
        }
      ],
    }),
    minAmount: 1
  };
};

const createProfilesList = () => Array.from({length: PROFILES_AMOUNT}, (__, index) => createProfile(index));

export {createProfilesList};
