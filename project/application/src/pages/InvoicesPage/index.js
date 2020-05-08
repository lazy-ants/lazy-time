import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { getInvoicesList } from '../../actions/InvoicesActions';

// Styles
import './style.scss';

//Components
import { Loading } from '../../components/Loading';
import CustomScrollbar from '../../components/CustomScrollbar';
import LastInvoicesList from '../../components/InvoicePageComponents/LastInvoicesList';
import AllInvoicesList from '../../components/InvoicePageComponents/AllInvoicesList';
import SendInvoiceModal from '../../components/InvoicePageComponents/SendInvoiceModal';
import TotalInvoiceCounersComponent from '../../components/InvoicePageComponents/TotalInvoiceCounersComponent';

class InvoicesPage extends Component {
    state = {
        // isInitialFetching: true,
        sendInvoiceModalData: null,
    };

    componentDidMount() {
        // setTimeout(() => this.setState({ isInitialFetching: false }), 500);
        this.props.getInvoicesList();
    }

    toggleSendInvoiceModal = (sendInvoiceModalData = null) => {
        this.setState({ sendInvoiceModalData });
    };

    render() {
        const { vocabulary, isMobile, invoices, isFetching, history, isInitialFetching } = this.props;
        const { v_invoices, v_add_new_invoice, v_all_invoices } = vocabulary;
        const { sendInvoiceModalData } = this.state;
        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <CustomScrollbar>
                    <div className="wrapper-invoices-page">
                        <Loading flag={isFetching} mode="overlay" withLogo={false}>
                            <div
                                className={classNames('invoices-page-top', {
                                    'invoices-page-top--mobile': isMobile,
                                })}
                            >
                                <div className="invoices-page-top__header">
                                    <div className="invoices-page-top__title">{v_invoices}</div>
                                    <Link to="/invoices/create" className="invoices-page-top__add-invoice-button">
                                        {v_add_new_invoice}
                                    </Link>
                                </div>
                                {!!invoices.length && (
                                    <div className="invoices-page-top__totals">
                                        <TotalInvoiceCounersComponent invoices={invoices} />
                                    </div>
                                )}
                                {!!invoices.length && (
                                    <div className="invoices-page-top__last-invoices">
                                        <LastInvoicesList
                                            invoices={invoices.slice(0, 4)}
                                            vocabulary={vocabulary}
                                            toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                        />
                                    </div>
                                )}
                            </div>

                            {!!invoices.length && (
                                <div className="invoices-page-bottom">
                                    {/* <div className="invoices-page-bottom__title">{v_all_invoices}</div> */}
                                    <div className="invoices-page-bottom__all-invoices">
                                        <AllInvoicesList
                                            toggleSendInvoiceModal={this.toggleSendInvoiceModal}
                                            invoices={invoices}
                                            vocabulary={vocabulary}
                                            history={history}
                                        />
                                    </div>
                                </div>
                            )}
                        </Loading>
                    </div>
                </CustomScrollbar>
                {sendInvoiceModalData && (
                    <SendInvoiceModal
                        closeModal={this.toggleSendInvoiceModal}
                        vocabulary={vocabulary}
                        invoice={sendInvoiceModalData}
                    />
                )}
            </Loading>
        );
    }
}

const mapStateToProps = ({ invoicesReducer }) => ({
    invoices: invoicesReducer.invoices,
    isFetching: invoicesReducer.isFetching,
    isInitialFetching: invoicesReducer.isInitialFetching,
});

const mapDispatchToProps = {
    getInvoicesList,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InvoicesPage)
);
