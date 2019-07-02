import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Services
import { responseErrorsHandling } from '../../services/responseErrorsHandling';
import { addProjectPreProcessing } from '../../services/mutationProjectsFunction';
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

export default class CreateProjectModal extends Component {
    state = {
        selectedValue: {
            id: 'a642f337-9082-4f64-8ace-1d0e99fa7258',
            name: 'green',
        },
        listOpen: false,
        selectValue: [],
    };

    setItem(value) {
        this.setState({
            selectedValue: value,
        });
    }

    toggleSelect() {
        this.setState({
            listOpen: !this.state.listOpen,
        });
    }

    addProject() {
        const project = addProjectPreProcessing(this.createProjectInput.value, this.state.selectedValue);
        if (!project) {
            return null;
        }
        apiCall(AppConfig.apiURL + `project/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project: {
                    name: project.name,
                    projectColorId: project.colorProject.id,
                },
            }),
        }).then(
            result => {
                this.props.getProjects();
                this.props.projectsPageAction('TOGGLE_MODAL', { toggle: false });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(error => {
                        const errorMessages = responseErrorsHandling.getErrorMessages(JSON.parse(error));
                        if (responseErrorsHandling.checkIsDuplicateError(errorMessages.join('\n'))) {
                            alert('Project is already existed');
                        } else {
                            alert(`Project can't be created`);
                        }
                    });
                } else {
                    console.log(err);
                }
            }
        );
    }

    render() {
        let selectItems = this.state.selectValue.map(value => (
            <div className={`item`} onClick={e => this.setItem(value)}>
                <div className={`circle ${value.name}`} />
            </div>
        ));

        return (
            <div className="wrapper_create_projects_modal">
                <div className="create_projects_modal_background" />
                <div className="create_projects_modal_container">
                    <div className="create_projects_modal_header">
                        <div className="create_projects_modal_header_title">
                            <Trans i18nKey="create_project">Create project</Trans>
                        </div>
                        <i
                            className="create_projects_modal_header_close"
                            onClick={e => this.props.projectsPageAction('TOGGLE_MODAL', { toggle: false })}
                        />
                    </div>
                    <div className="create_projects_modal_data">
                        <div className="create_projects_modal_data_input_container">
                            <input
                                type="text"
                                ref={input => {
                                    this.createProjectInput = input;
                                }}
                                placeholder={i18n.t('project_name')}
                            />
                            <div
                                className="create_projects_modal_data_select_container"
                                onClick={e => this.toggleSelect()}
                            >
                                <div className="select_main">
                                    <div className={`circle ${this.state.selectedValue.name}`} />
                                </div>
                                <i className="vector" />
                                {this.state.listOpen && <div className="select_list">{selectItems}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="create_projects_modal_button_container">
                        <button
                            className="create_projects_modal_button_container_button"
                            onClick={e => this.addProject(this.props.tableInfo)}
                        >
                            <Trans i18nKey="create_project">Create project</Trans>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        apiCall(AppConfig.apiURL + `project-color/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let data = result.data;
                this.setState({ selectValue: data.project_color });
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    }
}

CreateProjectModal.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
