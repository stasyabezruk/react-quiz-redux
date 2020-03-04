import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from './store/reducers';
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
    return createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk)),
        // window.__REDUX_DEVTOOLS_EXTENSION__(),
    )
};


export default configureStore;
