import axios from '../../axios/axios-quiz';
import {
    FETCH_QUIZ_SUCCESS,
    FETCH_QUIZES_ERROR,
    FETCH_QUIZES_START,
    FETCH_QUIZES_SUCCESS, FINISH_QUIZ, QUIZ_NEXT_QUESTION, QUIZ_RETRY,
    QUIZ_SET_STATE
} from "./actionTypes";

export const fetchQuizes = () => {
    return async dispatch => {
        dispatch(fetchQuizesStart())
        try {
            const response = await axios.get('/quizes.json');
            const quizes = [];
            Object.keys(response.data).forEach((key, idx) => {
                quizes.push({
                    id: key,
                    name: `Test ${idx+1}`
                })
            });
            dispatch(fetchQuizesSuccess(quizes));
        } catch (e) {
            dispatch(fetchQuizesError(e));
        }
    }
};

const fetchQuizesStart = () => {
    return {
        type: FETCH_QUIZES_START
    }
};

const fetchQuizesSuccess = quizes => {
    return {
        type: FETCH_QUIZES_SUCCESS,
        quizes
    }
};

const fetchQuizesError = error => {
    return {
        type: FETCH_QUIZES_ERROR,
        error
    }
};

export const fetchQuizById = (quizId) => {
    return async dispatch => {
        dispatch(fetchQuizesStart())
        try {
            const response = await axios.get(`/quizes/${quizId }.json`);
            const quiz = response.data;
           dispatch(fetchQuizByIdSuccess(quiz));
        } catch (e) {
            dispatch(fetchQuizesError(e));
        }
    }
};

const fetchQuizByIdSuccess = quiz => {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz
    }
};

export const quizAnswerCLick = answerId => {
    return (dispatch, getState) => {
        const state = getState().quiz;

        if (state.answerState) {
            const key = Object.keys(state.answerState)[0]
            if (state.answerState[key] === 'success') {
                return
            }
        }

        const question = state.quiz[state.activeQuestion]
        const results = state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            dispatch(quizSetState({[answerId]: 'success'}, results));

            const timeout = window.setTimeout(() => {
                if (isQuizFinished(state)) {
                    dispatch(finishQuiz());
                } else {
                  dispatch(quizNextQuestion(state.activeQuestion));
                }
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            results[question.id] = 'error';
            dispatch(quizSetState({[answerId]: 'error'}, results));
        }
    }
};

const quizSetState = (answerState, results) => {
    return {
        type: QUIZ_SET_STATE,
        answerState,
        results
    }
};

const finishQuiz = () => {
    return {
        type: FINISH_QUIZ
    }
};

const quizNextQuestion = questionNumber => {
    return {
        type: QUIZ_NEXT_QUESTION,
        questionNumber
    }
};
const isQuizFinished = state => {
    return state.activeQuestion + 1 === state.quiz.length
};

export const retryQuiz = () => {
    return {
        type: QUIZ_RETRY
    }
};


