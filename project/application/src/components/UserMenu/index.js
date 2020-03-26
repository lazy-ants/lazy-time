import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppConfig } from '../../config';

// Services

// Styles
import './style.scss';
import { logoutByUnauthorized } from '../../services/authentication';
import defaultLogo from '../../images/icons/Group20.svg';

class UserMenu extends Component {
    state = {
        activeUserMenu: false,
    };

    closeDropdown = e => {
        this.setState({ activeUserMenu: false });
        document.removeEventListener('click', this.closeDropdown);
    };

    openDropdown = e => {
        document.addEventListener('click', this.closeDropdown);
        this.setState({ activeUserMenu: true });
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.closeDropdown);
    }

    render() {
        const { switchMenu, vocabulary, isMobile, user, isShowMenu } = this.props;
        const { v_log_out, v_profile_settings, v_more_option } = vocabulary;

        const { username: userName } = user;
        return (
            <div
                className={classNames('wrapper_user_menu', { 'wrapper_user_menu--mobile': isMobile })}
                onClick={e => {
                    this.openDropdown();
                }}
            >
                <div className={classNames('logout_container', { 'logout_container--show_menu': isShowMenu  && !isMobile })} >
                    {(!isShowMenu || isMobile) && <div className="user_name">{userName}</div>}
                    {user.avatar ? (
                        <div
                            id="avatar-img-small"
                            style={{
                                backgroundImage: `url("${AppConfig.apiURL}${user.avatar}")`,
                            }}
                            title={v_more_option}
                        />
                    ) : (
                        <img alt="default_avatar" src={defaultLogo} className="default-logo" />
                    )}
                    {this.state.activeUserMenu && (
                        <div className={classNames('user_setting_modal',
                            {
                                'user_setting_modal--show_menu': isShowMenu && !isMobile
                            })} >
                            <Link
                                onClick={e => {
                                    isMobile && switchMenu();
                                }}
                                to="/user-settings"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="user_setting_modal_item">
                                    <i className="user_settings" />
                                    <span>{v_profile_settings}</span>
                                </div>
                            </Link>
                            <div className="user_setting_modal_item" onClick={e => logoutByUnauthorized()}>
                                <i className="logout" />
                                <span>{v_log_out}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    isMobile: state.responsiveReducer.isMobile,
    user: state.userReducer.user,
});

export default connect(mapStateToProps)(UserMenu);
