import React, { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteInvoiceById, editInvoicePaymentStatus } from '../../../actions/InvoicesActions';
import { spaceAndFixNumber, fixNumberHundredths } from '../../../services/numberHelpers';

// Styles
import './style.scss';
import { Link } from 'react-router-dom';

export const CheckIcon = ({ className, onClick, fill }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="9" fill="white" />
        <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
            fill={fill}
        />
    </svg>
);

export const EditIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z"
            fill="white"
        />
    </svg>
);

export const SaveIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M19 12V19H5V12H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z"
            fill="white"
        />
    </svg>
);

export const CopyIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5L21 11V21C21 22.1 20.1 23 19 23H7.99C6.89 23 6 22.1 6 21L6.01 7C6.01 5.9 6.9 5 8 5H15ZM14 12H19.5L14 6.5V12Z"
            fill="white"
        />
    </svg>
);

export const DeleteIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
            fill="white"
        />
    </svg>
);

export const SendIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white" />
    </svg>
);

const prevent = e => {
    e.preventDefault();
    e.stopPropagation();
};

const AllInvoicesList = ({
    invoices,
    vocabulary,
    toggleSendInvoiceModal,
    history,
    deleteInvoiceById,
    editInvoicePaymentStatus,
    isFetching,
    copyInvoice,
    isMobile,
    dateFormat,
}) => {
    const switchMenu = window.innerWidth < 1200;
    const { v_draft, v_paid, v_overdue } = vocabulary;
    const styleSpan = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '50px' };

    const getInvoiceType = invoice => {
        if (invoice.payment_status) {
            return 'paid';
        } else {
            if (moment().isBefore(moment(invoice.due_date))) {
                return 'draft';
            } else {
                return 'overdue';
            }
        }
    };
    const getInvoice = invoice => {
        if (invoice.payment_status) {
            return v_paid;
        } else {
            if (moment().isBefore(moment(invoice.due_date))) {
                return v_draft;
            } else {
                return v_overdue;
            }
        }
    };
    return (
        <div className="all-invoices-list">
            {invoices.map(invoice => {
                const [openMenu, setOpenMenu] = useState(false);

                const toggleOpenMenu = () => {
                    setOpenMenu(!openMenu);
                };

                return (
                    <Link
                        to={`/invoices/view/${invoice.id}`}
                        key={invoice.id}
                        className={classNames('all-invoices-list-item', {
                            'all-invoices-list-item--confirmed': getInvoiceType(invoice) === 'paid',
                            'all-invoices-list-item--overdue': getInvoiceType(invoice) === 'overdue',
                            'all-invoices-list-item--draft': getInvoiceType(invoice) === 'draft',
                        })}
                    >
                        <div className="all-invoices-list-item__block">
                            <div className="all-invoices-list-item__wrapper">
                                <div className="all-invoices-list-item__number">{`#${invoice.invoice_number}`}</div>
                                <div className="all-invoices-list-item__name">{invoice.to.name}</div>
                            </div>
                        </div>
                        <div className="all-invoices-list-item__block">
                            <div className="all-invoices-list-item__price">
                                <div> {invoice.currency}</div>{' '}
                                <span style={invoice.total > 20000 ? styleSpan : {}}>
                                    {fixNumberHundredths(spaceAndFixNumber(invoice.total))}
                                </span>
                            </div>
                            <div className="all-invoices-list-item__date-wrapper">
                                <div className="all-invoices-list-item__date">
                                    {moment(invoice.invoice_date).format(dateFormat)}
                                </div>
                                <div className="all-invoices-list-item__date">
                                    {moment(invoice.due_date).format(dateFormat)}
                                </div>
                            </div>
                        </div>
                        <div className="all-invoices-list-item__status-button" onClick={e => prevent(e)}>
                            <div className="all-invoices-list-item__status-button-container">
                                <span className="all-invoices-list-item__status-button-container-text">
                                    {getInvoice(invoice).toLowerCase()}
                                </span>
                                <div>
                                    <CheckIcon
                                        className="all-invoices-list-item__icon-button"
                                        fill={
                                            getInvoiceType(invoice) === 'paid'
                                                ? '#27AE60'
                                                : getInvoiceType(invoice) === 'overdue'
                                                    ? '#EB5757'
                                                    : '#626262'
                                        }
                                        onClick={e => editInvoicePaymentStatus(invoice.id, !invoice.payment_status)}
                                    />
                                </div>
                            </div>
                        </div>
                        {switchMenu && (
                            <div
                                className={classNames('dropdown-menu', { open: openMenu })}
                                onClick={e => {
                                    toggleOpenMenu();
                                    prevent(e);
                                }}
                                onBlur={e => {
                                    if (openMenu) {
                                        setTimeout(() => {
                                            toggleOpenMenu();
                                        }, 200);
                                    }
                                }}
                            >
                                <button className="menu-btn" />
                                <div className="menu-content">
                                    <EditIcon
                                        className="all-invoices-list-item__icon-button"
                                        onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                                    />
                                    <SaveIcon className="all-invoices-list-item__icon-button" />
                                    <CopyIcon
                                        className="all-invoices-list-item__icon-button"
                                        onClick={() => copyInvoice(invoice)}
                                    />

                                    <DeleteIcon
                                        className="all-invoices-list-item__icon-button"
                                        onClick={() => deleteInvoiceById(invoice.id)}
                                    />
                                    <SendIcon
                                        className="all-invoices-list-item__icon-button"
                                        onClick={() => toggleSendInvoiceModal(invoice)}
                                    />
                                </div>
                            </div>
                        )}
                        {!switchMenu && (
                            <div className="all-invoices-list-item__instruments" onClick={prevent}>
                                <EditIcon
                                    className="all-invoices-list-item__icon-button"
                                    onClick={e => history.push(`/invoices/update/${invoice.id}`)}
                                />
                                <SaveIcon className="all-invoices-list-item__icon-button" />
                                <CopyIcon
                                    className="all-invoices-list-item__icon-button"
                                    onClick={() => copyInvoice(invoice)}
                                />
                                <DeleteIcon
                                    className="all-invoices-list-item__icon-button"
                                    onClick={() => deleteInvoiceById(invoice.id)}
                                />
                                <SendIcon
                                    className="all-invoices-list-item__icon-button"
                                    onClick={() => toggleSendInvoiceModal(invoice)}
                                />
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

const mapStateToProps = ({ invoicesReducer, userReducer }) => ({
    isFetching: invoicesReducer.isFetching,
    dateFormat: userReducer.dateFormat,
});

const mapDispatchToProps = {
    deleteInvoiceById,
    editInvoicePaymentStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllInvoicesList);