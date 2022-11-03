import { combineReducers, legacy_createStore as createStore } from 'redux';
// import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import entriesReducer from '../reducers/entries.reducers';

const configureStore = () => {
  return createStore(
    combineReducers({
      entries: entriesReducer,
    }),
    composeWithDevTools()
  );
};

export default configureStore;
