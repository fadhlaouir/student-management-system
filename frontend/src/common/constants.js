/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
// process
export const {
  REACT_APP_DEVELOPMENT_API_URL,
  REACT_APP_DEFAULT_DATE_FORMAT,
} = process.env;

/**
 * @constant dateFormat = In Tunisia/France, the all-numeric form for dates is
 * in the order "day month year"
 */
export const dateFormat = REACT_APP_DEFAULT_DATE_FORMAT;

/* -------------------------------------------------------------------------- */
/*                            HEADERS IN EXPORT CSV                           */
/* -------------------------------------------------------------------------- */
/**
 * Headers are the columns of csv file
 * Label is the column name
 * Key is for mapping data with the corresponding column
 */
export const EXPORT_CSV_HEADERS = [
  { label: 'Prenom', key: 'firstName' },
  { label: 'Nom', key: 'lastName' },
  { label: 'Genre', key: 'gender' },
  { label: 'Age', key: 'age' },
  { label: 'Date de naissance', key: 'dateOfBirth' },
  { label: 'E-mail', key: 'email' },
  { label: 'Numéro de téléphone', key: 'phoneNumber' },
  { label: 'Statut', key: 'status' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Updated At', key: 'updatedAt' },
];

export const CURRENCIES = [
  { value: 'USD', symbol: 'USD' },
  { value: 'EUR', symbol: 'EUR' },
  { value: 'TND', symbol: 'TND' },
];
