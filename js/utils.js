const getRandomPositiveInteger = (a, b = 1) => {
  if (a === undefined) {
    throw new Error('Первый параметр должен быть число');
  }

  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно.
const getRandomFloatNumber = (a, b, digits = 1) => {
  if (a === undefined) {
    throw new Error('Первый параметр должен быть число');
  }

  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;
  return +result.toFixed(digits);
};

const isEscapeKey = (evt) => evt.keyCode === 27;
const isEnterKey = (evt) => evt.keyCode === 13;

const getRandomArrayElement = (array) => array[getRandomPositiveInteger(0, array.length - 1)];


const defaultProfile = {
  id: 0,
  balance: {
    currency: 'KEKS',
    amount: 10
  },
  exchangeRate: 1,
  isVerified: false,
  status: 'seller',
  userName: 'Julia',
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
};


export {getRandomArrayElement, getRandomFloatNumber, isEscapeKey, isEnterKey, getRandomPositiveInteger, defaultProfile};
