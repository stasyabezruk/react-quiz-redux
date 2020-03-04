import {CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION} from "./actionTypes";
import axios from "../../axios/axios-quiz";

export const createQuizQuestion = item => {
    return {
        type: CREATE_QUIZ_QUESTION,
        item
    }
};

const resetQuizCreation = () => {
    return {
        type: RESET_QUIZ_CREATION
    }
};

export const finishCreateQuiz = () => {
    return async (dispatch, getState) => {
        await axios.post('/quizes.json', getState().quizCreator.quiz);
        dispatch(resetQuizCreation())
    }
};
