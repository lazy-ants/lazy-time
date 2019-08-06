import { getUserData, setAvatar, deleteAvatar } from '../configAPI';

// Services
// import { setCurrentTeamDataToLocalStorage } from '../services/currentTeamDataStorageService';
import { logoutByUnauthorized } from '../services/authentication';

// Actions
import reportsPageAction from './ReportsPageAction';
import { setLanguage } from './LanguageActions';
import { getUserTeamsAction, getCurrentTeamAction, getCurrentTeamDetailedDataAction } from './TeamActions';

export const GET_USER_DATA_REQUEST = 'GET_USER_DATA_REQUEST';
export const GET_USER_DATA_REQUEST_SUCCESS = 'GET_USER_DATA_REQUEST_SUCCESS';
export const GET_USER_DATA_REQUEST_FAIL = 'GET_USER_DATA_REQUEST_FAIL';
export const SET_USER_AVATAR_REQUEST = 'SET_USER_AVATAR_REQUEST';
export const SET_USER_AVATAR_REQUEST_SUCCESS = 'SET_USER_AVATAR_REQUEST_SUCCESS';
export const SET_USER_AVATAR_REQUEST_FAIL = 'SET_USER_AVATAR_REQUEST_FAIL';
export const RESET_ALL = 'RESET_ALL';
export const CHANGE_USER_DATA = 'CHANGE_USER_DATA';
export const TOGGLE_MODAL = 'TOGGLE_MODAL';

const getUserDataRequest = () => ({
    type: GET_USER_DATA_REQUEST,
});

const getUserDataRequestSuccess = payload => ({
    type: GET_USER_DATA_REQUEST_SUCCESS,
    payload,
});

const getUserDataRequestFail = payload => ({
    type: GET_USER_DATA_REQUEST_FAIL,
    payload,
});

export const changeUserData = payload => ({
    type: CHANGE_USER_DATA,
    payload,
});

export const resetAll = () => ({
    type: RESET_ALL,
});

export const toggleModal = payload => ({
    type: TOGGLE_MODAL,
    payload,
});

export const checkUserDataAction = () => async dispatch => {
    try {
        const { data } = await getUserData();
        const { language } = data;

        dispatch(setLanguage(language));
        dispatch(changeUserData(data));
    } catch (error) {
        logoutByUnauthorized();
    }
};

export const getUserDataAction = () => async dispatch => {
    dispatch(getUserDataRequest());
    try {
        const { data } = await getUserData();
        const { language } = data;

        dispatch(
            reportsPageAction('SET_ACTIVE_USER', {
                data: [data.email],
            })
        );

        dispatch(setLanguage(language));
        dispatch(getUserDataRequestSuccess(data));
        dispatch(getUserTeamsAction());
        dispatch(getCurrentTeamAction());
        dispatch(getCurrentTeamDetailedDataAction());
    } catch (error) {
        logoutByUnauthorized();
        dispatch(getUserDataRequestFail(error));
    }
};

// SET_USER_AVATAR

const setUserAvatarRequest = () => ({
    type: SET_USER_AVATAR_REQUEST,
});

const setUserAvatarRequestSuccess = payload => ({
    type: SET_USER_AVATAR_REQUEST_SUCCESS,
    payload,
});

const setUserAvatarRequestFail = payload => ({
    type: SET_USER_AVATAR_REQUEST_FAIL,
    payload,
});

export const setUserAvatarAction = (id, formData) => async dispatch => {
    dispatch(setUserAvatarRequest());
    try {
        const { data } = await setAvatar(id, formData);

        dispatch(setUserAvatarRequestSuccess(data));
    } catch (error) {
        dispatch(setUserAvatarRequestFail(error));
    }
};

export const deleteUserAvatarAction = id => async dispatch => {
    dispatch(setUserAvatarRequest());
    try {
        const { data } = await deleteAvatar(id);

        dispatch(setUserAvatarRequestSuccess(data));
    } catch (error) {
        dispatch(setUserAvatarRequestFail(error));
    }
};
