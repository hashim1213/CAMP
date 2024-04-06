import { configureStore } from '@reduxjs/toolkit';
import farmsReducer from './farmsSlice'; 
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import teamReducer from './teamSlice';

// A simple counter reducer (assuming it's not in its own slice file)
const counterReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, value: state.value + 1 };
    case 'counter/decrement':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    // Combine both reducers under the reducer property
    chat: chatReducer,
    team: teamReducer,
    user: userReducer,
    farms: farmsReducer,
    counter: counterReducer,
  },
});
