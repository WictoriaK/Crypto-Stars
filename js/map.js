import {PAYMENT_PROVIDER, VIEW_TYPE, MAIN_COORDINATES} from './const.js';
import {getActiveTabDatasetValue, getItemsByType} from './global.js';

import {
  sellers,
  calculateSellerLimit,
  createProfileBadgesHTML,
  checkedUsersButton,
  verifiedSellers
} from './profiles.js';


const tabsControlsElement = document.querySelector('.tabs--toggle-list-map .tabs__controls');
const userListElement = document.querySelector('.users-list');
const mapElement = document.querySelector('#map');


const mainPinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [36, 46],
  iconAnchor: [18, 46],
});

const verifiedPinMarkerIcon = L.icon({
  iconUrl: 'img/pin-verified.svg',
  iconSize: [36, 46],
  iconAnchor: [18, 46],
});

const hasCashPayment = ({paymentMethods}) => paymentMethods?.some(({provider}) => provider === PAYMENT_PROVIDER.CASH);


const sellersInCash = sellers.filter(hasCashPayment);
const verifiedSellersInCash =  sellersInCash.filter(({isVerified}) => isVerified);

const profilesMap = {
  [VIEW_TYPE.LIST]: {
    all: sellers,
    verified: verifiedSellers,
  },
  [VIEW_TYPE.MAP]: {
    all: sellersInCash,
    verified: verifiedSellersInCash,
  }
}



const createCustomPopup = (profile) => {
  const limit = calculateSellerLimit(profile);
  const paymentBadges = createProfileBadgesHTML(profile);
  const {userName, isVerified, balance: {currency},  exchangeRate} = profile;

  return `<div class="user-card">
           <span class="user-card__user-name">
                ${isVerified ? `<svg width="20" height="20" aria-hidden="true">
                    <use xlink:href="#icon-star"></use>
                </svg>` : ''}
                <span>${userName}</span>
            </span>
            <p class="user-card__cash-item"><span class="user-card__cash-label">Валюта</span><span
                    class="user-card__cash-data">${currency}</span></p>
            <p class="user-card__cash-item"><span class="user-card__cash-label">Курс</span><span
                    class="user-card__cash-data">${exchangeRate} ₽</span></p>
            <p class="user-card__cash-item"><span class="user-card__cash-label">Лимит</span><span
                    class="user-card__cash-data">${limit} ₽</span></p>
            <ul class="user-card__badges-list">
                ${paymentBadges}
            </ul>
            <button class="btn btn--green user-card__change-btn" type="button">Обменять
            </button>
        </div>`
}

const map = L.map('map').setView(MAIN_COORDINATES, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const getPinCoordinates = (sellerProfile) => sellerProfile?.coords ?? null;

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (profile) => {
  const coords = getPinCoordinates(profile);

  if(!coords) {
    return;
  }

  const {lat, lng} = coords;

  const mapPin = L.marker( {
      lat,
      lng,
    },
    {
      draggable: true,
      icon: getPinIcon(profile)
    },
  );

 mapPin.addTo(markerGroup).bindPopup(createCustomPopup(profile));
}

const getPinIcon = (profile) => {
  return profile.isVerified
    ? verifiedPinMarkerIcon
    : mainPinIcon;
};

const getCurrentViewType = () => getActiveTabDatasetValue(tabsControlsElement, 'viewType', VIEW_TYPE.LIST);

const renderProfiles = (profiles) => profiles.forEach(createMarker);


const updateProfilesDisplay = () => {
  markerGroup.clearLayers();

  const onlyVerified = checkedUsersButton?.checked ?? false;
  const profilesToRender = getItemsByType(
    profilesMap,
    getCurrentViewType(),
    onlyVerified
  );

  renderProfiles(profilesToRender);
}

const handleTabClick = (evt) => {
  const clickedTab = evt.target.closest('.tabs--toggle-list-map .tabs__control');

  if (!clickedTab) {
    return
  }

  tabsControlsElement.querySelectorAll('.tabs__control').forEach(tab => {
    tab.classList.remove('is-active');
  });

  clickedTab.classList.add('is-active');

  const viewType = clickedTab.dataset.viewType;

  userListElement.classList.toggle('hidden', viewType !== VIEW_TYPE.LIST);
  mapElement.classList.toggle('hidden', viewType !== VIEW_TYPE.MAP);

  updateProfilesDisplay();
}

const handleRadioChangeClick = (evt) => {
  updateProfilesDisplay();
}

const initMap = () => {
  tabsControlsElement.addEventListener('click', handleTabClick);

  if(checkedUsersButton) {
    checkedUsersButton.addEventListener('change', handleRadioChangeClick);
  }

  updateProfilesDisplay();
};


initMap();






