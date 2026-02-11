import {getRandomArrayElement, getRandomFloatNumber} from './utils.js';

const CONTRACTORS_AMOUNT = 10;
const contractorsNamesArray = ['Emily', 'James', 'Sophia', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Mia', 'Lucas'];

const createContractor = (index) => ({
  id: index,
  balance: {
    currency: 'KEKS',
    amount: getRandomFloatNumber(1, 2000)
  },
  exchangeRate: getRandomFloatNumber(1000, 3000),
  isVerified: false,
  status: 'seller',
  userName: getRandomArrayElement(contractorsNamesArray),
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
  minAmount: 1
});


const createContractorsList = () => Array.from({length: CONTRACTORS_AMOUNT}, (__, index) => createContractor(index));

export {createContractorsList};
