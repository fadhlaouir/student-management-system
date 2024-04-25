/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */
// Packages
import moment from 'moment-timezone';

/* ----------------------------- RENDER HELPERS ----------------------------- */
/**
 * Update Timezone to Tunis zone
 * @param {Date} date
 * @returns Tunis Timezone
 */
export const localMoment = (date) => moment(date).tz('Africa/Tunis').format('YYYY-MM-DD');
