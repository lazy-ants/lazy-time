import axios from 'axios';

import { logoutByUnauthorized } from './services/authentication';

import { getDataStorageDateByPlan } from './services/timeService';

import { AppConfig } from './config';

import { getTokenFromLocalStorage } from './services/tokenStorageService';

import _ from 'lodash';

const baseURL = AppConfig.apiURL;

const instance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const postPartialPayments = ({ invoiceId, sum, date, comments }) =>
    instance({
        url: `/invoice/${invoiceId}/payment`,
        method: 'POST',
        data: {
            sum: sum,
            date: date,
            comments: comments,
        },
    });

export const getPartialPayments = id =>
    instance({
        url: `invoice/${id}/payment-list`,
        method: 'GET',
    });

export const setSocialConnect = (userId, { socialId, socialName }) =>
    instance({
        url: `user/${userId}/set-social/${socialName}`,
        method: 'POST',
        data: {
            socialId,
        },
    });

export const loginWithFacebook = ({ email = '', id, name: username, language, timezoneOffset }) =>
    instance({
        url: '/user/login-fb',
        method: 'POST',
        data: {
            email,
            id,
            username,
            language,
            timezoneOffset,
        },
    });

export const getUserData = () =>
    instance({
        url: '/user',
        method: 'GET',
    });

export const getUserTeams = () =>
    instance({
        url: '/user/teams',
        method: 'GET',
    });

export const getCurrentTeam = () =>
    instance({
        url: '/team/current',
        method: 'GET',
    });

export const addTeam = ({ teamName }) =>
    instance({
        url: '/team/add',
        method: 'POST',
        data: {
            teamName,
        },
    });

export const getCurrentTeamDetailedData = () =>
    instance({
        url: '/team/current/detailed-data',
        method: 'GET',
    });

export const switchTeam = ({ teamId }) =>
    instance({
        url: '/team/switch',
        method: 'PATCH',
        data: {
            teamId,
        },
    });

export const setAvatar = (id, data) =>
    instance({
        url: `/user/${id}/avatar`,
        method: 'POST',
        data,
    });

export const deleteAvatar = id =>
    instance({
        url: `/user/${id}/avatar`,
        method: 'DELETE',
    });

export const tutorialChecked = (id, key) =>
    instance({
        url: `user/${id}`,
        method: 'PATCH',
        data: {
            onboardingMobile: key,
        },
    });

export const getClientsList = async (params = {}) => {
    return instance({
        url: '/client/list',
        method: 'GET',
        params,
    });
};

export const addClient = data =>
    instance({
        url: 'client/add',
        method: 'POST',
        data,
    });

export const editClient = (data, id) =>
    instance({
        url: `client/${id}`,
        method: 'PATCH',
        data,
    });

export const deleteClient = id =>
    instance({
        url: `client/${id}`,
        method: 'DELETE',
    });

export const changeClientActiveStatus = (clientId, status) =>
    instance({
        url: `client/${clientId}/active-status`,
        method: 'PATCH',
        data: {
            isActive: status,
        },
    });

export const deleteTask = id =>
    instance({
        url: `/timer/${id}`,
        method: 'DELETE',
    });

export const getTimeEntriesList = (params = {}) =>
    instance({
        url: '/timer/user-list',
        method: 'GET',
        cancelToken: params.cancelToken,
        params: _.omit(params, ['cancelToken']),
    });

export const getCurrentTime = () =>
    instance({
        url: '/time/current',
        method: 'GET',
    });

export const getProjectsList = ({
    withTimerList = false,
    withUserInfo = false,
    page = null,
    limit = null,
    searchValue = null,
    isActive = null,
}) => {
    const params = {
        withTimerList,
        withUserInfo,
        page,
        limit,
        isActive,
        searchValue,
    };
    return instance({
        url: '/project/list',
        method: 'GET',
        params,
    });
};

export const getRelationProjectsList = syncType =>
    instance({
        url: `/project/${syncType}/list`,
        method: 'GET',
    });

// keys for data: issue, projectId, startDatetime, endDatetime, timezoneOffset
export const changeTask = (id, data) =>
    instance({
        url: `/timer/${id}`,
        method: 'PATCH',
        data,
    });

export const syncTaskWithJira = id =>
    instance({
        url: `/sync/jira/issue/${id}/worklog`,
        method: 'POST',
    });

export const userInvite = ({ email }) =>
    instance({
        url: '/user/invite',
        method: 'POST',
        data: {
            email,
        },
    });

// UNUSED AXIOS REQUESTS

export const userChangePassword = ({ password, newPassword }) =>
    instance({
        url: '/user/change-password',
        method: 'POST',
        data: {
            password,
            newPassword,
        },
    });

export const addProject = ({ name, projectColorId, users }) =>
    instance({
        url: '/project/add',
        method: 'POST',
        data: {
            project: {
                name,
                projectColorId,
            },
            users,
        },
    });

export const getProjectColorList = () =>
    instance({
        url: '/project-color/list',
        method: 'GET',
    });

export const changeProject = ({ id, name, projectColorId, users }) =>
    instance({
        url: `/project/${id}`,
        method: 'PATCH',
        data: {
            project: {
                name,
                projectColorId,
            },
            users,
        },
    });

export const changeUserInTeam = ({ id, email, username, isActive, roleName }) =>
    instance({
        url: `/user/${id}/team`,
        method: 'PATCH',
        data: {
            email,
            username,
            isActive,
            roleName,
        },
    });

export const renameTeam = ({ teamId, newName }) =>
    instance({
        url: '/team/rename',
        method: 'PATCH',
        data: {
            teamId,
            newName,
        },
    });

export const signIn = ({ email, password, timezoneOffset }) =>
    instance({
        url: '/user/login',
        method: 'POST',
        data: {
            email,
            password,
            timezoneOffset,
        },
    });

export const signUp = ({ email, password, language, timezoneOffset }) =>
    instance({
        url: '/user/register',
        method: 'POST',
        data: {
            email,
            password,
            language,
            timezoneOffset,
        },
    });

export const getProjectReports = ({ projectName, startDate, endDate }) =>
    instance({
        url: '/project/reports-project',
        method: 'GET',
        params: {
            projectName,
            startDate,
            endDate,
        },
    });

export const getExportReport = ({ timezoneOffset, startDate, endDate }) =>
    instance({
        url: '/report/export',
        method: 'GET',
        params: {
            timezoneOffset,
            startDate,
            endDate,
        },
    });

export const getReportsProjects = ({ startDate, endDate }) =>
    instance({
        url: '/project/reports-projects',
        method: 'GET',
        params: {
            startDate,
            endDate,
        },
    });

export const getTimerReportsList = ({ startDate, endDate }) =>
    instance({
        url: '/timer/reports-list',
        method: 'GET',
        params: {
            startDate,
            endDate,
        },
    });

export const getUserList = () =>
    instance({
        url: '/timer/reports-list',
        method: 'GET',
    });

export const requestChangeUserData = (data, id) =>
    instance({
        url: `user/${id}`,
        method: 'PATCH',
        data,
    });

export const verifyJiraToken = ({ token, urlJira }) =>
    instance({
        url: 'sync/jira/my-permissions',
        method: 'GET',
        params: {
            token,
            urlJira,
        },
    });

// Add a request interceptor
instance.interceptors.request.use(
    config => {
        const token = getTokenFromLocalStorage();
        if (token) {
            return {
                ...config,
                headers: { ...config.headers, Authorization: `Bearer ${token}` },
            };
        }

        return config;
    },
    error => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            if (error.response.data.statusCode === 401) {
                logoutByUnauthorized();
            }
            return Promise.reject(error);
        }
        return;
    }
);

export const resetPassword = email =>
    instance({
        url: '/user/reset-password',
        method: 'POST',
        data: {
            email,
        },
    });

export const setPassword = ({ password, token }) =>
    instance({
        url: '/user/set-password',
        method: 'POST',
        data: {
            password,
            token,
        },
    });

export const syncAllTasksWithJira = () =>
    instance({
        url: `sync/jira/worklog?dateFrom=${getDataStorageDateByPlan(-30)}`, // change to needed start date, by donut plane
        method: 'POST',
    });

export const createInvoice = data =>
    instance({
        url: '/invoice/add',
        method: 'POST',
        data,
    });

export const getInvoices = params =>
    instance({
        url: `/invoice/list`,
        method: 'GET',
        params,
    });

export const getInvoicesTotal = params =>
    instance({
        url: `/invoice/total`,
        method: 'GET',
        params,
    });

export const getInvoicesCountsByStatus = params =>
    instance({
        url: `/invoice/total-by-status`,
        method: 'GET',
        params,
    });

export const getInvoiceViewData = id =>
    instance({
        url: `/invoice/${id}`,
        method: 'GET',
    });

export const getInvoiceById = invoiceId =>
    instance({
        url: `/invoice/${invoiceId}`,
        method: 'GET',
    });

export const sendInvoiceLetter = (invoiceId, data) =>
    instance({
        url: `/invoice/${invoiceId}/sendInvoice`,
        method: 'POST',
        data,
    });

export const changeInvoice = ({ invoiceId, data }) =>
    instance({
        url: `/invoice/${invoiceId}`,
        method: 'PATCH',
        data,
    });

export const deleteInvoice = invoiceId =>
    instance({
        url: `/invoice/${invoiceId}`,
        method: 'DELETE',
    });

export const changeInvoiceStatus = ({ invoiceId, paymentStatus }) =>
    instance({
        url: `/invoice/${invoiceId}/payment-status`,
        method: 'PATCH',
        data: {
            paymentStatus,
        },
    });

export const downloadInvoicePDF = id =>
    instance({
        url: `/invoice/${id}/pdf`,
        responseType: 'blob',
        method: 'GET',
    });

export const searchTechnologies = title =>
    instance({
        url: `technology/list?title=${title}`,
        method: 'GET',
    });

export const addTechnology = title =>
    instance({
        url: 'technology/add',
        method: 'POST',
        data: {
            title,
        },
    });

export const deleteUserFromProject = (userId, projectId) =>
    instance({
        url: `project/user/${projectId}`,
        method: 'DELETE',
        data: {
            id: userId,
        },
    });

export const changeProjectActiveStatus = (projectId, status) =>
    instance({
        url: `project/${projectId}/active-status`,
        method: 'PATCH',
        data: {
            isActive: status,
        },
    });
