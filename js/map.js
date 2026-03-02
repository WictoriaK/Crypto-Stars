import {sellers, calculateSellerLimit, createProfileBadgesHTML, checkedUsersButton, init} from './profiles.js';

const PAYMENT_PROVIDER = {
  CASH: 'Cash in person',
};

const MAIN_COORDINATES = {
  LAT: 59.92749,
  LNG:  30.31127
};

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

const sellersInCash = sellers.filter((seller) => seller.paymentMethods?.some(({provider}) => provider === PAYMENT_PROVIDER.CASH));

const verifiedSellersInCash =  sellersInCash.filter(({isVerified}) => isVerified);

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

const map = L.map('map').setView({
  lat: MAIN_COORDINATES.LAT,
  lng: MAIN_COORDINATES.LNG,
}, 10);


L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const getPinCoordinates = (sellerProfile) => {
  const payment = sellerProfile?.paymentMethods?.find(({provider}) => provider === PAYMENT_PROVIDER.CASH)

  return payment?.coords ?? null;
}


const markerGroup = L.layerGroup().addTo(map);

const createMarker = (profile, pinIcon) => {
  const coords = getPinCoordinates(profile);

  if(!coords) {
    return;
  }

  const {lat, lng} = coords;

  const mapPin = L.marker({
      lat,
      lng,
    },
    {
      draggable: true,
      icon: pinIcon
    },
  );

 mapPin.addTo(markerGroup).bindPopup(createCustomPopup(profile));
}

const getPinIcon = (profile) => {
  return profile.isVerified
    ? verifiedPinMarkerIcon
    : mainPinIcon;
};


const renderProfiles = (profiles) => {
  profiles.forEach((profile) => {
    createMarker(profile, getPinIcon(profile));
  });
}

const getProfilesByType = (onlyVerified = false) => onlyVerified ? verifiedSellersInCash : sellersInCash;

const updateProfilesDisplay = () => {

  const onlyVerified = checkedUsersButton?.checked ?? false;
  const profilesToRender = getProfilesByType(onlyVerified);

  renderProfiles(profilesToRender);
}

const handleRadioChangeClick = (evt) => {
  markerGroup.clearLayers();
  updateProfilesDisplay()
}

const initMap = () => {
  updateProfilesDisplay();

  if(checkedUsersButton) {
    checkedUsersButton.addEventListener('change', handleRadioChangeClick);
  }
};

const handeTabClick = (evt) => {
  const clickedTab = evt.target.closest('.tabs--toggle-list-map .tabs__control');

  if (!clickedTab) {
    return
  }

  document.querySelectorAll('.tabs--toggle-list-map .tabs__control.is-active').forEach(tab => {
    tab.classList.remove('is-active');
  });

  clickedTab.classList.add('is-active');

  userListElement.classList.add('hidden');
  mapElement.classList.remove('hidden');

  initMap;
}


tabsControlsElement.addEventListener('click', handeTabClick);




