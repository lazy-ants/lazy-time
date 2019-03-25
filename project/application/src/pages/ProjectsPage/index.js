import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import ProjectSearchBar from '../../components/projectSearchBar';
import ProjectData from '../../components/ProjectsData';
import CreateProjectModal from '../../components/CreateProjectModal';
import projectsPageAction from '../../actions/ProjectsActions';
import { client } from '../../requestSettings';
import { getProjects, getProjectTime } from '../../queries';
import { checkAuthentication } from '../../services/authentication';
import { timeInSeconds } from '../../pages/MainPage/timeInSecondsFunction';
import { AppConfig } from '../../config';

class ProjectsPage extends Component {
    toggleModal(item) {
        item('TOGGLE_MODAL', true);
    }
    state = {
        etalonArr: [],
        activeEmail: '',
        projectsTime: {},
    };

    canAddToTeam(email = '') {
        email = atob(email);
        const adminEmails = AppConfig.adminEmails;

        if (adminEmails.indexOf(email) > -1) {
            return true;
        } else {
            return false;
        }
    }

    gatTimeSpentOfProject(projectsTime) {
        let obj = {};
        for (let i = 0; i < projectsTime.length; i++) {
            if (obj[projectsTime[i].project]) {
                obj[projectsTime[i].project] = obj[projectsTime[i].project] + timeInSeconds(projectsTime[i].timePassed);
            } else {
                obj[projectsTime[i].project] = 0;
                obj[projectsTime[i].project] = obj[projectsTime[i].project] + timeInSeconds(projectsTime[i].timePassed);
            }
        }
        this.setState({ projectsTime: obj });
    }

    render() {
        const { tableData, addNewProjectModalToggle, projectsPageAction } = this.props;

        return (
            <div className="wrapper_projects_page">
                {checkAuthentication()}
                {addNewProjectModalToggle && (
                    <CreateProjectModal tableInfo={tableData} projectsPageAction={projectsPageAction} />
                )}
                <LeftBar />
                <div className="data_container_projects_page">
                    <div className="projects_page_header">
                        <div className="projects_page_title">Projects</div>
                        {this.canAddToTeam(this.state.activeEmail) && (
                            <button
                                className="create_project_button"
                                onClick={e => projectsPageAction('TOGGLE_MODAL', { toggle: true })}
                            >
                                Create new project
                            </button>
                        )}
                    </div>
                    <div className="project_page_filters">
                        <ProjectSearchBar
                            tableInfo={this.props.tableData}
                            etalonArr={this.state.etalonArr}
                            projectsPageAction={projectsPageAction}
                        />
                    </div>
                    <div className="project_data_wrapper">
                        <ProjectData
                            activeEmail={this.state.activeEmail}
                            canAddToTeam={this.canAddToTeam}
                            tableInfo={tableData}
                            projectsPageAction={projectsPageAction}
                            projectsTime={this.state.projectsTime}
                        />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        client.request(getProjectTime(atob(localStorage.getItem('active_email')))).then(data => {
            this.gatTimeSpentOfProject(data.timeTracker);
        });
        client.request(getProjects).then(data => {
            this.setState({ etalonArr: data.project });
            this.props.projectsPageAction('CREATE_PROJECT', { toggle: false, tableData: data.project });
        });
        this.setState({ activeEmail: localStorage.getItem('active_email') });
    }

    componentWillUnmount() {
        client.request(getProjects).then(data => {
            this.props.projectsPageAction('CREATE_PROJECT', { toggle: false, tableData: data.project });
        });
    }
}

const mapStateToProps = store => {
    return {
        tableData: store.projectReducer.tableData,
        addNewProjectModalToggle: store.projectReducer.addNewProjectModalToggle,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        projectsPageAction: (actionType, toggle) => dispatch(projectsPageAction(actionType, toggle))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsPage);
