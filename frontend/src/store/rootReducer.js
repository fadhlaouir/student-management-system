import { combineReducers } from 'redux';

import Session from '../reducers/Session.slice';
import User from '../reducers/User.slice';
import Companies from '../reducers/Companies.slice';

export default combineReducers({
  Session,
  User,
  Companies,
});
