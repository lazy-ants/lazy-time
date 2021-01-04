import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Services
import { apiCall } from '../../services/apiService';
import { responseErrorsHandling } from '../../services/responseErrorsHandling';

// Components

// Actions
import { getCurrentTeamAction, getUserTeamsAction, getCurrentTeamDetailedDataAction } from '../../actions/TeamActions';
import { showNotificationAction } from '../../actions/NotificationActions';
import { switchMenu } from '../../actions/ResponsiveActions';

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

class CreateTeamModal extends Component {
    addTeam() {
        const {
            vocabulary,
            getUserTeamsAction,
            getCurrentTeamAction,
            getCurrentTeamDetailedDataAction,
            history,
            showNotificationAction,
        } = this.props;
        const { v_a_team_name_empty_error, v_a_team_existed, v_a_team_create_error } = vocabulary;
        const createTeam = (this.createTeamInput.value || '').trim();
        if (createTeam.length) {
            // this.props.createTeamRequest(createTeam);
            apiCall(AppConfig.apiURL + `team/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamName: createTeam,
                }),
            }).then(
                res => {
                    getUserTeamsAction();
                    getCurrentTeamAction();
                    getCurrentTeamDetailedDataAction();
                    history.push('/team');
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(error => {
                            const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                            if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                showNotificationAction({ text: v_a_team_existed, type: 'warning' });
                            } else {
                                showNotificationAction({ text: v_a_team_create_error, type: 'error' });
                            }
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
            this.closeModal();
        } else {
            showNotificationAction({ text: v_a_team_name_empty_error, type: 'warning' });
        }
    }

    getWrapper() {
        return document.querySelector('.wrapper');
    }

    addZIndexToWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.add('wrapper_z-index-1');
        }
    }

    removeZIndexFromWrapper() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            wrapper.classList.remove('wrapper_z-index-1');
        }
    }

    closeModal() {
        this.removeZIndexFromWrapper();
        this.props.teamAddPageAction('TOGGLE_TEAM_ADD_MODAL', { toggle: false });
        this.props.closeTeamList();
        this.props.isMobile && this.props.switchMenu();
    }

    render() {
        const { vocabulary } = this.props;
        const { v_team_name, v_create_team } = vocabulary;

        this.addZIndexToWrapper();

        return (
            <div className="wrapper_create_team_modal">
                <div className="create_team_modal_background" />
                <div className="create_team_modal_container">
                    <div className="create_team_modal_header">
                        {v_create_team}
                        <i className="create_team_modal_header_close" onClick={e => this.closeModal()} />
                    </div>
                    <div className="create_team_modal_data">
                        <div className="create_team_modal_data_input_container">
                            <input
                                autoFocus
                                type="text"
                                ref={input => {
                                    this.createTeamInput = input;
                                }}
                                placeholder={`${v_team_name}...`}
                            />
                        </div>
                    </div>
                    <div className="create_team_modal_button_container">
                        <button className="create_team_modal_button_container_button" onClick={e => this.addTeam()}>
                            {v_create_team}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

const mapDispatchToProps = {
    getUserTeamsAction,
    getCurrentTeamAction,
    getCurrentTeamDetailedDataAction,
    showNotificationAction,
    switchMenu,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CreateTeamModal)
);
