import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import './style.scss';

const NoConnectionSVG = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M40.9705 7.02947C36.4376 2.49638 30.4106 0 24 0C17.5894 0 11.5624 2.49638 7.02947 7.02947C2.49638 11.5624 0 17.5894 0 24C0 30.4106 2.49638 36.4376 7.02947 40.9705C11.5625 45.5036 17.5894 48 24 48C30.4106 48 36.4376 45.5036 40.9705 40.9705C45.5036 36.4376 48 30.4106 48 24C48 17.5894 45.5036 11.5624 40.9705 7.02947ZM2.91412 24C2.91412 12.3732 12.3732 2.91412 24 2.91412C29.2901 2.91412 34.1312 4.87284 37.8369 8.10253L32.8289 13.1106C30.1125 11.7879 27.1103 11.0881 24 11.0881C18.6065 11.0881 13.5356 13.1885 9.72169 17.0024C9.15263 17.5714 9.15263 18.494 9.72169 19.0629C10.2907 19.6319 11.2133 19.6319 11.7822 19.0629C15.0457 15.7995 19.3848 14.0021 24 14.0021C26.3116 14.0021 28.5537 14.4532 30.6262 15.3131L27.4177 18.5218C26.3165 18.2288 25.17 18.0768 24 18.0768C20.4731 18.0768 17.1574 19.4503 14.6634 21.9442C14.0944 22.5131 14.0944 23.4357 14.6634 24.0047C14.948 24.2892 15.3208 24.4315 15.6937 24.4315C16.0665 24.4315 16.4394 24.2892 16.7239 24.0047C18.6674 22.0612 21.2513 20.9908 23.9998 20.9908C24.3049 20.9908 24.6079 21.0048 24.9083 21.0309L8.10253 37.837C4.87284 34.1312 2.91412 29.2902 2.91412 24ZM26.5309 28.7498C27.9263 30.1453 27.9263 32.4159 26.5309 33.8115C25.1353 35.2069 22.8647 35.2071 21.4692 33.8115C20.0737 32.4159 20.0737 30.1453 21.4692 28.7498C22.1669 28.0521 23.0835 27.7032 24 27.7032C24.9166 27.7032 25.8331 28.0521 26.5309 28.7498ZM24 45.0859C18.7099 45.0859 13.8688 43.1272 10.1631 39.8975L17.6156 32.4449C17.8428 33.7012 18.4395 34.903 19.4087 35.872C20.6746 37.1379 22.3372 37.7708 24.0001 37.7708C25.6629 37.7708 27.3257 37.1379 28.5915 35.872C31.1231 33.3404 31.1231 29.2208 28.5915 26.6891C27.6225 25.72 26.4206 25.1233 25.1645 24.8961L28.1858 21.8748C29.323 22.3814 30.3693 23.0979 31.276 24.0047C31.845 24.5738 32.7676 24.5737 33.3366 24.0047C33.9056 23.4357 33.9056 22.5131 33.3366 21.9442C32.4405 21.0481 31.4379 20.2975 30.3579 19.7025L33.3292 16.7313C34.3609 17.3957 35.3294 18.1745 36.2178 19.0628C36.5023 19.3474 36.8752 19.4897 37.248 19.4897C37.6208 19.4897 37.9938 19.3474 38.2782 19.0628C38.8473 18.4939 38.8473 17.5713 38.2782 17.0023C37.393 16.1171 36.4394 15.3256 35.4305 14.6298L39.8974 10.1629C43.1271 13.8687 45.0858 18.7097 45.0858 23.9998C45.0859 35.6268 35.6268 45.0859 24 45.0859Z"
            fill="white"
        />
    </svg>
);

const ConnectionRestoredSVG = () => (
    <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.3161 15.63C6.37803 16.568 6.37803 18.0947 7.3161 19.042C8.25418 19.9801 9.78085 19.9801 10.7281 19.042C17.2211 12.549 27.7882 12.549 34.2812 19.042C34.7502 19.511 35.3664 19.7501 35.9826 19.7501C36.5988 19.7501 37.2149 19.511 37.684 19.042C38.6221 18.1039 38.6221 16.5772 37.684 15.63C29.3149 7.25168 15.6852 7.25168 7.3161 15.63Z"
            fill="white"
        />
        <path
            d="M13.8276 22.1413C12.8895 23.0794 12.8895 24.6061 13.8276 25.5533C14.7657 26.4914 16.2923 26.4914 17.2396 25.5533C20.1366 22.6472 24.8637 22.6472 27.7607 25.5533C28.2298 26.0224 28.846 26.2615 29.4621 26.2615C30.0783 26.2615 30.6945 26.0224 31.1636 25.5533C32.1016 24.6153 32.1016 23.0886 31.1636 22.1505C26.3904 17.359 18.6099 17.359 13.8276 22.1413Z"
            fill="white"
        />
        <path
            d="M22.5 34.0144C24.2726 34.0144 25.7097 32.5774 25.7097 30.8047C25.7097 29.0321 24.2726 27.595 22.5 27.595C20.7273 27.595 19.2903 29.0321 19.2903 30.8047C19.2903 32.5774 20.7273 34.0144 22.5 34.0144Z"
            fill="white"
        />
        <path
            d="M44.2964 9.00828C32.2762 -3.00276 12.7238 -3.00276 0.703556 9.00828C-0.234519 9.94635 -0.234519 11.473 0.703556 12.4203C1.64163 13.3584 3.1683 13.3584 4.11557 12.4203C14.2505 2.27621 30.7495 2.27621 40.8936 12.4203C41.3627 12.8893 41.9788 13.1284 42.595 13.1284C43.2112 13.1284 43.8274 12.8893 44.2964 12.4203C45.2345 11.4822 45.2345 9.95555 44.2964 9.00828Z"
            fill="white"
        />
    </svg>
);

class ModalInfo extends Component {
    state = {
        showModal: false,
        modalInfoContent: {},
    };

    componentDidMount() {
        window.addEventListener('online', this.connectionRestore);
        window.addEventListener('offline', this.connectionLost);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.connectionRestore);
        window.removeEventListener('offline', this.connectionLost);
    }

    connectionRestore = e => {
        const { v_connection_restored } = this.props.vocabulary;
        this.showModalInfo(v_connection_restored, 'connection-restored');
    };

    connectionLost = e => {
        const { v_connection_problem } = this.props.vocabulary;
        this.showModalInfo(v_connection_problem, 'lost-connection');
    };

    showModalInfo = (text, type) => {
        this.setState({ showModal: true, modalInfoContent: { text, type } });
    };

    hideModalInfo = () => {
        this.setState({
            showModal: false,
            modalInfoContent: {},
        });
    };

    render() {
        const { showModal, modalInfoContent } = this.state;
        return (
            <div
                className={classNames(
                    'modal-info',
                    { 'modal-info--mobile': this.props.isMobile },
                    { 'modal-info--hidden': !showModal }
                )}
                onClick={this.hideModalInfo}
            >
                <div className={classNames('modal-info-icon', `modal-info-icon--${modalInfoContent.type}`)}>
                    {modalInfoContent.type === 'lost-connection' ? <NoConnectionSVG /> : <ConnectionRestoredSVG />}
                </div>
                <div className="modal-info-text">
                    <p>{modalInfoContent.text}</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

export default connect(mapStateToProps)(ModalInfo);