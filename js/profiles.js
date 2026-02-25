import {createProfilesList} from './mock/profiles-data.js';
import {defaultProfile} from './utils.js';

const USER_TYPES = {
  SELLER: 'seller',
  BUYER: 'buyer'
};

const profilesListElement = document.querySelector('.users-list__table-body');
const tabsControlsElement = document.querySelector('.tabs__controls');
const checkedUsersButton = document.querySelector('#checked-users');

const similarProfilesList = createProfilesList();

const [sellers, buyers] = similarProfilesList.reduce((accum, profile) => {
  accum[profile.status === 'seller' ? 0 : 1].push(profile);

  return accum;
},
  [[], []]
);

const verifiedSellers = sellers.filter((seller) => seller.isVerified);
const verifiedBuyers = buyers.filter((seller) => seller.isVerified);


const isSeller = (profile) => profile.status === USER_TYPES.SELLER;

const createProfileBadgesHTML = (profile) => isSeller(profile) ? `<ul class="users-list__badges-list">
${profile.paymentMethods.map((method) => `<li class="users-list__badges-item badge">${method.provider}</li>`).join('')}</ul>` : '';

const calculateSellerLimit = (profile) => {
  const {status, balance, exchangeRate} = profile;

  if(!balance.amount || typeof balance.amount !== 'number') {
    console.warn('Invalid balance data for profile:', profile);
    return 'N/A';
  }

  return status === USER_TYPES.SELLER
    ? (balance.amount * exchangeRate).toFixed(2)
    : balance.amount.toFixed(2);
};

const getVarifiedIcon = (isVerified) => isVerified ? '<svg width="20" height="20" aria-hidden="true"><use xlink:href="#icon-star"></use></svg>' : '';

const getNoResultMessage = () => `<div class="message message--noresults"><span class="message__icon">
              <svg width="60" height="60" aria-hidden="true">
                <use xlink:href="#icon-no-results"></use>
              </svg></span>
            <p class="message__paragraph">Нет подходящих объявлений
              <a class="link"></a>
            </p>
          </div>`;


const createTableRow = (profile = defaultProfile) => {
  try {
    const sellerLimit = calculateSellerLimit(profile);
    const verifiedIcon = getVarifiedIcon(profile.isVerified);
    const paymentBadges = createProfileBadgesHTML(profile);

    return `
    <tr class="users-list__table-row" data-user="${profile.id}">
      <td class="users-list__table-cell users-list__table-name">${verifiedIcon}<span>${profile.userName}</span></td>
      <td class="users-list__table-cell users-list__table-currency">${profile.balance.currency}</td>
      <td class="users-list__table-cell users-list__table-exchangerate">${profile.exchangeRate}</td>
      <td class="users-list__table-cell users-list__table-cashlimit">${profile.minAmount} ₽-${sellerLimit} ₽</td>
      <td class="users-list__table-cell users-list__table-payments">
       ${paymentBadges}
      </td>
      <td class="users-list__table-cell users-list__table-btn">
          <button class="btn btn--greenborder sell-btn" type="button" data-user="${profile.id}">Обменять</button>
       </td>
    </tr>
  `;
  } catch (error) {
    console.error('Error creating table row for profile:', profile, error);
    return getNoResultMessage();
  }

};


const renderProfiles = (profiles = []) => {
  if (!profilesListElement) {
    console.warn('Table body element not found');
    return;
  }

  profilesListElement.innerHTML = profiles.length > 0
    ? profiles.map((profile) => createTableRow(profile)).join('')
    : getNoResultMessage();
};


const getCurrentUserType = () => {
  const activeTab = document.querySelector('.tabs__control.is-active');

  return activeTab ? activeTab.dataset.userType : USER_TYPES.SELLER;
};


const getProfilesByType = (userType, onlyVerified = false) => {
  if (onlyVerified) {
    switch (userType) {
      case USER_TYPES.SELLER:
        return verifiedSellers;

      case USER_TYPES.BUYER:
        return verifiedBuyers;

      default:
        console.warn('Unknown user type:', userType);
        return [];
    }
  }

  switch (userType) {
    case USER_TYPES.SELLER:
      return sellers;

    case USER_TYPES.BUYER:
      return buyers;

    default:
      console.warn('Unknown user type:', userType);
      return [];
  }
};

const updateProfilesDisplay = () => {
  const currentUserType = getCurrentUserType();
  const onlyVerified = checkedUsersButton?.checked || false;
  const profilesToRender = getProfilesByType(currentUserType, onlyVerified);

  renderProfiles(profilesToRender);
}

const handeTabClick = (evt) => {
  const clickedTab = evt.target.closest('.tabs__control');

  if (!clickedTab) {
    return
  }

  document.querySelectorAll('.tabs__control.is-active').forEach(tab => {
    tab.classList.remove('is-active');
  });

  clickedTab.classList.add('is-active');

  updateProfilesDisplay();
}


const handleRadioChangeClick = () => {
  updateProfilesDisplay();
}

const init = () => {
  if (!profilesListElement || !tabsControlsElement) {
    console.error('Required DOM elements not found');
    return;
  }

  renderProfiles(sellers);

  tabsControlsElement.addEventListener('click', handeTabClick);

  if(checkedUsersButton) {
    checkedUsersButton.addEventListener('change', handleRadioChangeClick);
  }
};


export { init }

