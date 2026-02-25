import {renderUserProfile} from './set-user.js';
import './modal.js';
import {init} from './profiles.js';

renderUserProfile();

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
};
