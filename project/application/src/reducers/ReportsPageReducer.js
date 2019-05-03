import * as moment from 'moment';

import { getCurrentDate } from '../services/timeService';
import { getTimeDurationByGivenTimestamp } from '../services/timeService';
import { getUserEmailFromLocalStorage } from '../services/userStorageService';

const initialState = {
    timeRange: {
        startDate: getCurrentDate(),
        endDate: getCurrentDate(),
        key: 'selection',
        firstDayOfWeek: 1,
    },
    setUser: [getUserEmailFromLocalStorage()],
    dataBarChat: {
        defaultFontColor: 'red',
        labels: [],
        datasets: [
            {
                label: 'Total hrs by date',
                fill: true,
                lineTension: 0.1,
                backgroundColor: '#56CCF2',
                borderColor: '#56CCF2',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#56CCF2',
                scaleFontColor: '#FFFFFF',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#56CCF2',
                pointHoverBorderColor: '#56CCF2',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            },
        ],
    },
    projectsArr: [],
    dataDoughnutChat: {
        labels: [],
        options: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return getTimeDurationByGivenTimestamp(+moment(tooltipItem.yLabel));
                    },
                },
            },
        },
        datasets: [
            {
                data: [],
                backgroundColor: [
                    '#7B68EE',
                    '#191970',
                    '#000080',
                    '#2F80ED',
                    '#6FCF97',
                    '#BB6BD9',
                    '#7B68EE',
                    '#2F80ED',
                    '#6FCF97',
                    '#BB6BD9',
                    '#039',
                    '#339',
                    '#639',
                    '#939',
                    '#C39',
                    '#F39',
                    '#03C',
                    '#33C',
                    '#63C',
                    '#93C',
                    '#C3C',
                    '#F3C',
                    '#03F',
                    '#33F',
                    '#63F',
                    '#93F',
                    '#C3F',
                ],
                hoverBackgroundColor: ['#2F80ED', '#6FCF97', '#BB6BD9'],
            },
        ],
    },
    dataFromServer: [],
    selectedProjects: [],
};

export function reportsPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_LINE_GRAPH':
            return { ...state, dataBarChat: action.payload };
        case 'SET_DATA_FROM_SERVER':
            return { ...state, dataFromServer: action.payload.data };
        case 'SET_DOUGHNUT_GRAPH':
            return { ...state, dataDoughnutChat: action.payload.data };
        case 'SET_PROJECTS':
            return { ...state, projectsArr: action.payload.data };
        case 'SET_TIME':
            return { ...state, timeRange: action.payload.data };
        case 'SET_ACTIVE_USER':
            return { ...state, setUser: action.payload.data };
        case 'SET_SELECTED_PROJECTS':
            return { ...state, selectedProjects: action.payload.data };
        default:
            return state;
    }
}
