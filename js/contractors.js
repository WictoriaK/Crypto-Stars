import { createContractorsList } from './contractors-data.js';

const contractorsListElement = document.querySelector('.users-list__table-body');
const similarContractorsList = createContractorsList();

const createProviderBadgesHTML = (paymentMethods) => paymentMethods ? paymentMethods.map((method )=> `<li class="users-list__badges-item badge">${method.provider}</li>`).join('') : '';

const createTableRow = ({ userName, isVerified, balance, exchangeRate, minAmount, status, paymentMethods }) => {
  const sellerLimit = status === 'seller'
    ? (balance.amount * exchangeRate).toFixed(2)
    : balance.amount;

  const verifiedIcon = isVerified
    ? `<svg width="20" height="20" aria-hidden="true"><use xlink:href="#icon-star"></use></svg>`
    : '';

  return `
    <tr class="users-list__table-row">
      <td class="users-list__table-cell users-list__table-name">${verifiedIcon}<span>${userName}</span></td>
      <td class="users-list__table-cell users-list__table-currency">${balance.currency}</td>
      <td class="users-list__table-cell users-list__table-exchangerate">${exchangeRate}</td>
      <td class="users-list__table-cell users-list__table-cashlimit">${minAmount} ₽-${sellerLimit} ₽</td>
      <td class="users-list__table-cell users-list__table-payments">
        <ul class="users-list__badges-list">${createProviderBadgesHTML(paymentMethods)}</ul>
      </td>
      <td class="users-list__table-cell users-list__table-btn">
                <button class="btn btn--greenborder" type="button">Обменять
                </button>
            </td>
    </tr>
  `;
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

export { renderContractorsProfiles };
