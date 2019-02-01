import React, { Component } from 'react';
import './style.css';
import PropTypes from 'prop-types'

export default class ProjectData extends Component {
    render() {
        let tableInfo = this.props.tableInfo;
        const tableHeader = [
            {
                key: 1,
                value: 'Project name'
            },
            {
                key: 2,
                value: 'Status'
            },
            {
                key: 3,
                value: 'Team'
            },

        ];
        const tableInfoElements = tableInfo.map(item =>
            <tr key={item.id}>
                <td>{item.projectName}</td>
                <td>{item.projectStatus}</td>
                <td>{item.team}</td>
            </tr>
        );
        const tableHeaderElements = tableHeader.map(item => <th key={item.key}>{item.value}</th>);
        return (
            <div className="project_data_wrapper">
                <table>
                    <thead>
                    <tr>
                        {tableHeaderElements}
                    </tr>
                    </thead>
                    <tbody>
                    {tableInfoElements}
                    </tbody>
                </table>
            </div>
        )
    }
}

ProjectData.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
