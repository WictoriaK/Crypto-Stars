import { createContractorsList } from './mock/contractors-data.js';

const contractorsListElement = document.querySelector('.users-list__table-body');
const checkedUsersButton = document.querySelector('#checked-users');


const defaulContractor = {
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


const similarContractorsList = createContractorsList();

const createProviderBadgesHTML = (paymentMethods) => paymentMethods ? paymentMethods.map((method )=> `<li class="users-list__badges-item badge">${method.provider}</li>`).join('') : '';

const calculateSellerLimit = (contactor = defaulContractor) => {
  const {status, balance, exchangeRate} = contactor;

  return status === 'seller'
    ? (balance.amount * exchangeRate).toFixed(2)
    : balance.amount;
};

const getVarifiedIcon = (isVerified) => isVerified ? '<svg width="20" height="20" aria-hidden="true"><use xlink:href="#icon-star"></use></svg>' : '';


const createTableRow = (contractor) => {

  const sellerLimit = calculateSellerLimit(contractor);
  const verifiedIcon = getVarifiedIcon(contractor.isVerified);
  const paymentBadges = createProviderBadgesHTML(contractor.paymentMethods);

  return `
    <tr class="users-list__table-row" data-user="${contractor.id}">
      <td class="users-list__table-cell users-list__table-name">${verifiedIcon}<span>${contractor.userName}</span></td>
      <td class="users-list__table-cell users-list__table-currency">${contractor.balance.currency}</td>
      <td class="users-list__table-cell users-list__table-exchangerate">${contractor.exchangeRate}</td>
      <td class="users-list__table-cell users-list__table-cashlimit">${contractor.minAmount} ₽-${sellerLimit} ₽</td>
      <td class="users-list__table-cell users-list__table-payments">
        <ul class="users-list__badges-list">${paymentBadges}</ul>
      </td>
      <td class="users-list__table-cell users-list__table-btn">
          <button class="btn btn--greenborder sell-btn" type="button" data-user="${contractor.id}">Обменять</button>
       </td>
    </tr>
  `;
};


const renderVerifiedContactorsList = () => {
  const verifiedContractors = similarContractorsList.filter((contractor) => contractor.isVerified);


  if (!verifiedContractors) {
    contractorsListElement.innerHTML = '<tr class="users-list__table-row"><td>Нет проверенных продавцов</td></tr>';
    return;
  }

  contractorsListElement.innerHTML = ''; // Очистка

  verifiedContractors.forEach((item) => {
    const rowHTML = createTableRow(item);
    contractorsListElement.insertAdjacentHTML('beforeend', rowHTML);
  });
};

const renderContractorsProfiles = () => {
  if (!contractorsListElement) {
    return;
  }

  contractorsListElement.innerHTML = ''; // Очистка

  similarContractorsList.forEach((item) => {
    const rowHTML = createTableRow(item);
    contractorsListElement.insertAdjacentHTML('beforeend', rowHTML);
  });
};

checkedUsersButton.addEventListener('change', (evt) => evt.target.checked ? renderVerifiedContactorsList() : renderContractorsProfiles());


export { renderContractorsProfiles, similarContractorsList };
