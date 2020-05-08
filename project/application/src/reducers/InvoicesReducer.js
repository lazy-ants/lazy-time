import moment from 'moment';
import {
    CREATE_INVOICE_REQUEST,
    GET_INVOICE_LIST_REQUEST,
    GET_INVOICE_LIST_SUCCESS,
    GET_INVOICE_BY_ID_REQUEST,
    GET_INVOICE_BY_ID_SUCCESS,
    CHANGE_INVOICE_REQUEST,
    DELETE_INVOICE_REQUEST,
    CHANGE_INVOICE_STATUS_REQUEST,
} from '../actions/InvoicesActions';

const initialState = {
    invoices: [],
    invoice: null,
    isFetching: false,
    isInitialFetching: false,
};

export default function invoicesReducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_INVOICE_BY_ID_REQUEST:
            return {
                ...state,
                isFetching: true,
                invoice: null,
            };
        case GET_INVOICE_BY_ID_SUCCESS:
            return {
                ...state,
                isFetching: false,
                invoice: payload,
            };
        case CHANGE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case CHANGE_INVOICE_STATUS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case DELETE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case CREATE_INVOICE_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case GET_INVOICE_LIST_REQUEST:
            return {
                ...state,
                isInitialFetching: true,
            };
        case GET_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isInitialFetching: false,
                invoices: payload,
            };
        default:
            return state;
    }
}
