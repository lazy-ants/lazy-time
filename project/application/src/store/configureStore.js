import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { rootReducer } from '../reducers';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require(`redux-logger`);

    const logger = createLogger({
        collapsed: true,
    });

    middlewares.push(logger);
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
