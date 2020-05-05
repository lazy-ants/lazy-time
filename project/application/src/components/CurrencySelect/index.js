import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { scrollToAction } from '../../actions/ResponsiveActions';

// Styles
import './style.scss';

const currencies = ['usd', 'eur', 'uah'];

const ArrowIcon = className => (
    <svg className={className} width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 7L0.73686 0.25L10.2631 0.250001L5.5 7Z" fill="white" />
    </svg>
);

class CurrencySelect extends Component {
    state = {
        isOpen: false,
        inputValue: '',
    };

    // static getDerivedStateFromProps(props, state) {
    //     if (state.projectsList === null) {
    //         const { projectsList } = props;
    //         return {
    //             projectsList,
    //         };
    //     }
    //     return null;
    // }

    openDropdown = event => {
        const { onChangeVisibility, disabled } = this.props;
        if (disabled) return;
        this.setState(
            {
                isOpen: true,
            },
            () => onChangeVisibility(true)
        );
        document.addEventListener('click', this.closeDropdown);
    };

    closeDropdown = event => {
        if (!event.target.classList.contains('currency-select__dropdown-list-input')) {
            const { onChangeVisibility } = this.props;
            document.removeEventListener('click', this.closeDropdown);
            this.setState(
                {
                    isOpen: false,
                },
                () => onChangeVisibility(false)
            );
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const { isOpen } = this.state;
        const { scrollToAction, withFolder } = this.props;
        const { dropdown } = this.refs;

        if (!prevState.isOpen && isOpen) {
            if (!withFolder) {
                const height = window.innerHeight || window.document.documentElement.clientHeight;
                const boundingClientRect = dropdown.getBoundingClientRect();
                const { bottom } = boundingClientRect;
                if (bottom > height) {
                    const diff = bottom - height;
                    scrollToAction(diff);
                }
            }
        }
        if (prevState.isOpen && !isOpen) {
        }
    }

    componentWillUnmount() {
        const { onChangeVisibility } = this.props;
        onChangeVisibility(false);
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { vocabulary, onChange, listItem, isMobile, selectedCurrency } = this.props;
        const {} = vocabulary;
        const { isOpen } = this.state;

        return (
            <div
                className={classNames('currency-select', {
                    'currency-select--list-item': listItem,
                    'currency-select--mobile': isMobile,
                })}
                onClick={this.openDropdown}
            >
                <div className="currency-select__selected-currency">
                    <span className="currency-select__currency-name">{selectedCurrency.toUpperCase()}</span>
                    <ArrowIcon />
                </div>
                {isOpen && (
                    <div ref="dropdown" className={classNames('currency-select__dropdown')}>
                        <div className="currency-select__dropdown-list">
                            {currencies.map(currency => {
                                return (
                                    <div
                                        key={currency}
                                        className="currency-select__dropdown-list-item"
                                        onClick={event => onChange(currency)}
                                    >
                                        <span className="currency-select__dropdown-list-item-currency-name">
                                            {currency.toUpperCase()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

CurrencySelect.defaultProps = {
    onChangeVisibility: () => {},
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
});

const mapDispatchToProps = {
    scrollToAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CurrencySelect);
