/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import moment from 'moment-timezone';
import { API_ENDPOINT } from './config';

// Local Images
import FEMALE_AVATAR from '../assets/images/female-avatar.jpg';
import MALE_AVATAR from '../assets/images/male-avatar.jpg';
import EMPTY_IMAGE from '../assets/images/empty.png';

/* ----------------------------- RENDER HELPERS ----------------------------- */
/**
 * Update Timezone to Tunis zone
 * @param {Date} date
 * @returns Tunis Timezone
 */
export const localMoment = (date) => moment(date).tz('Africa/Tunis');

/**
 * Fetch data to all field value for the selected data
 * @param {Array} key exemple sector or governorate
 * @param {Array} value exemple service or municipality
 * @returns Array of string
 */
export const fetchData = (key, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (key[value]) resolve(key[value]);
      else reject(new Error('Pas trouvé'));
    }, 1500);
  });
};

/**
 * Return user avatar
 * @param {Object} user The user object
 * @returns String
 */
export function RetriveUserAvatar(user) {
  if (user?.photo !== '') {
    return `${API_ENDPOINT}/${user?.photo}`;
  }
  if (user?.gender === 'Homme' || user?.gender === 'homme') {
    return `${MALE_AVATAR}`;
  }
  return `${FEMALE_AVATAR}`;
}

/**
 * Return image
 * @param {String} photo
 * @returns String
 */
export function RetriveImage(photo) {
  if (photo !== '') {
    return `${API_ENDPOINT}/${photo}`;
  }
  return `${EMPTY_IMAGE}`;
}
