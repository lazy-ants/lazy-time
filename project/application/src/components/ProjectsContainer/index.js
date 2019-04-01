import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { Doughnut } from 'react-chartjs-2';

import './style.css';
import { getTimInStringSeconds } from '../../pages/MainPage/timeInSecondsFunction';

class ProjectsContainer extends Component {
    getIdOfProject(projectName) {
        for (let i = 0; i < this.props.allProjects.length; i++) {
            if (projectName === this.props.allProjects[i].name) {
                return this.props.allProjects[i].id;
            }
        }
    }

    getDateToLink(momentDate) {
        return moment(momentDate).format('YYYY-MM-DD');
    }

    render() {
        let projectsItems = this.props.projectsArr.map((item, index) => (
            <div className="projects_container_project_data" key={'projects_item' + index}>
                <div className="name">{item.name}</div>
                <div className="time">
                    {moment(item.duration)
                        .utc()
                        .format('HH:mm:ss')}
                </div>
            </div>
        ));

        return (
            <div className="projects_container_wrapper">
                <div className="projects_container_projects">
                    <div className="projects_header">
                        <div>Project name</div>
                        <div>Time</div>
                    </div>
                    <div className="projects_container_project_data_container">{projectsItems}</div>
                </div>
                <div className="chart">
                    <Doughnut data={this.props.dataDoughnutChat} width={303} height={303} />
                </div>
            </div>
        );
    }
}

export default ProjectsContainer;