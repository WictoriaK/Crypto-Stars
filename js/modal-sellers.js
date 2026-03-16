import {similarProfilesList, calculateSellerLimit} from './profiles.js';
import {userProfile} from './mock/user-data.js';
import {PASSWORD, PAYMENT_PROVIDER} from './const.js';
import {currentUserData} from './modal.js';

// console.log('user profile', userProfile)
// console.log('similarProfilesList', similarProfilesList)

const modalElement = document.querySelector('.modal');
const formElement = modalElement.querySelector('.modal-buy');
const formSendAmountInput = formElement.querySelector('.custom-input__sending-amount');
const formReceiveAmountInput = formElement.querySelector('.custom-input__receiving-amount');
const exchangeRateElement = modalElement.querySelector('.transaction-info__item--exchangerate .transaction-info__data');
const cashLimitElement = modalElement.querySelector('.transaction-info__item--cashlimit .transaction-info__data');
const allAmountButton = modalElement.querySelector('.custom-input__btn');
const paymentMethodElement = formElement.querySelector('.paymentMethod');
let bankCardNumberElement = formElement.querySelector('.custom-input__card-number');
const passwordElement = formElement.querySelector('.custom-input__password');



const allUserAvailableAmount = userProfile.balances[0].amount;

const pristine = new Pristine(formElement, {
  classTo: 'custom-input',
  errorClass: 'custom-input--invalid',
  successClass: 'custom-input--valid',
  errorTextParent: 'custom-input',
  errorTextTag: 'div',
  errorTextClass: 'custom-input__error'
});

const getRow = (id) => document.querySelector(`tr[data-user="${id}"]`);
const getDataSetUserId = (row) => row?.dataset.user;

const getProfileById = (id) => similarProfilesList.find(profile => profile.id === id);

const getProfileData = (id) => {
  const profile = getProfileById(+id);

  if(!profile) {
    return;
  }

  return {
    id,
    name: profile.userName,
    exchangeRate: profile.exchangeRate,
    minAmount: profile.minAmount,
    sellerLimit: calculateSellerLimit(profile),
    balance: profile.balance.amount,
    paymentMethods: profile.paymentMethods,
  };
};

const setPaymentMethods = (currentUserData) => currentUserData?.paymentMethods?.map(({provider}) => `<option value='${provider}'>${provider}</option>`).join('');

const paymentMethodSelect = (currentUserData) => `<select name="paymentMethod" class="paymentMethod">
                                  <option selected disabled>Выберите платёжную систему</option>
                                  ${setPaymentMethods(currentUserData)}
                                  </select>`

const setStaticData = (currentUserData) => {
  modalElement.querySelector('.transaction-info__item--name').textContent = currentUserData.name;
  exchangeRateElement.textContent = currentUserData.exchangeRate;
  cashLimitElement.textContent = `${currentUserData.minAmount} ₽ - ${currentUserData.sellerLimit} ₽`;

  paymentMethodElement.innerHTML = paymentMethodSelect(currentUserData);

};

const calculateAmount = (receiveAmount, exchangeRate) => exchangeRate ? exchangeRate * receiveAmount : '';

const handleAmountInput = ({input, output, calculation}) => {
  const value = Number(input.value) || 0;
  const exchangeRate = Number(exchangeRateElement.textContent);

  if(!exchangeRate || !value) {
    output.value = '';
    return;
  }

  output.value = calculation(value, exchangeRate);

};

const bindAmountInout = (input, output) => {
  input.addEventListener('input', () => {
    handleAmountInput({
      input,
      output,
      calculation: calculateAmount,
    })
  })
}

bindAmountInout(formSendAmountInput, formReceiveAmountInput);
bindAmountInout(formReceiveAmountInput, formSendAmountInput);

allAmountButton.addEventListener('click', () => {

  formSendAmountInput.value = allUserAvailableAmount;

  handleAmountInput({
    input: formSendAmountInput,
    output: formReceiveAmountInput,
    calculation: calculateAmount,
  });
});

const validateAmountInput = (value) => {
  const numberValue = Number(value);

  return numberValue >= 1 && numberValue <= allUserAvailableAmount;
};

const validateSendInput = (value) => {
  const userId = modalElement.dataset.userId;
  const currentUserData = getProfileData(userId);

  const numberValue = Number(value);

  return numberValue >= 1 && numberValue < currentUserData.balance;

};

pristine.addValidator(formSendAmountInput, validateAmountInput, 'Сумма превышает доступный лимит');
pristine.addValidator(formReceiveAmountInput, validateSendInput, 'Сумма превышает доступный лимит');


const findAccountNumber = (paymentMethods, method) =>  paymentMethods.find(({provider}) => provider === method);


const setBankCardNumber = (evt) => {
  const method = evt.target.value;
  const userId = modalElement.dataset.userId;
  const currentUserData = getProfileData(userId);
  const paymentMethods = currentUserData.paymentMethods;
  const selectedPaymentMethod = findAccountNumber(paymentMethods, method);
  const accountNumber =
    selectedPaymentMethod?.provider === PAYMENT_PROVIDER.CASH
      ? ''
      : selectedPaymentMethod?.accountNumber || '';

  bankCardNumberElement.placeholder = accountNumber;

  bankCardNumberElement.value = accountNumber;
};

paymentMethodElement.addEventListener("change", setBankCardNumber);

const validatePasswordInputValue = (value) => {
  return +value === PASSWORD;
}

pristine.addValidator(passwordElement, validatePasswordInputValue, 'Пароль неверный');

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const validate = pristine.validate();

  if(validate) {
    console.log('ok')
  } else {
    console.log('error')
  }

});


export { modalElement,getProfileData, setStaticData };
