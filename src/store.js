import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk';

import rootReducer from './reducers';

let middlewares = [
	applyMiddleware(thunk)
];

if (process.env.NODE_ENV === 'development') {
	middlewares = [
		applyMiddleware(thunk, logger),
	];
}

const configureStore = createStore(
	rootReducer,
	compose(...middlewares)
);

export default configureStore;