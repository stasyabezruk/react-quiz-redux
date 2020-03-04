import {combineReducers} from "redux";
import quizReducer from "./quiz.reducer";
import quizCreatorReducer from "./quizCreator.reducer";
import authReducer from "./auth.reducer";

export default combineReducers({
    quiz: quizReducer,
    quizCreator: quizCreatorReducer,
    auth: authReducer
});
