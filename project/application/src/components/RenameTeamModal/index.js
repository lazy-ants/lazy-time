import React, { Component } from 'react';

// Services
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { apiCall } from '../../services/apiService';
import { Trans } from 'react-i18next';
import i18n from './../../i18n';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

export default class RenameTeamModal extends Component {
    state = {
        newTeamName: '',
    };

    constructor(props) {
        super(props);
        this.teamNameRef = React.createRef();
    }

    setItem(value) {
        this.setState({
            selectedValue: value,
        });
    }

    renameTeam() {
        const teamName = (this.teamNameRef.current.value || '').trim();
        if (teamName.length) {
            apiCall(AppConfig.apiURL + `team/rename`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamId: this.props.teamId,
                    newName: teamName,
                }),
            }).then(
                result => {
                    this.props.refreshTeamName(result);
                    this.props.closeCallback();
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(error => {
                            const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                            if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                                alert('Team is already existed');
                            } else {
                                alert(`Team can't be renamed`);
                            }
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            alert("Project name can't be empty!");
        }
    }

    render() {
        return (
            <div className="wrapper_rename_team_modal">
                <div className="rename_team_modal_background" />
                <div className="rename_team_modal_container">
                    <div className="rename_team_modal_header">
                        <div className="rename_team_modal_header_title">
                            <Trans i18nKey="edit_team_name">Edit Team Name</Trans>
                        </div>
                        <i className="rename_team_modal_header_close" onClick={e => this.props.closeCallback()} />
                    </div>
                    <div className="rename_team_modal_data">
                        <div className="rename_team_modal_data_input_container">
                            <input type="text" ref={this.teamNameRef} placeholder={i18n.t('team_name')} />
                        </div>
                    </div>
                    <div className="rename_team_modal_button_container">
                        <button className="rename_team_modal_button_container_button" onClick={e => this.renameTeam()}>
                            <Trans i18nKey="rename_team">Rename Team</Trans>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
