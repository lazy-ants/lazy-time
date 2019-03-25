import React, { Component } from 'react';
import { connect } from 'react-redux';

import './style.css';
import LeftBar from '../../components/LeftBar';
import AddToTeamModal from '../../components/AddToTeamModal';
import { client } from '../../requestSettings';
import { getTeamData } from '../../queries';
import teamPageAction from '../../actions/TeamPageAction';
import { checkAuthentication } from '../../services/authentication';
import { AppConfig } from '../../config';

class TeamPage extends Component {
    headerItems = ['Name', 'E-mail', 'Access'];
    state = {
        activeEmail: '',
    };

    openAddUserModal() {
        this.props.teamPageAction('TOGGLE_ADD_USER_MODAL', { createUserModal: !this.props.createUserModal });
    }

    canAddToTeam(email) {
        email = atob(email);
        const adminEmails = AppConfig.adminEmails;

        if (adminEmails.indexOf(email) > -1) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        let programersArr = this.props.programersArr;
        const headerItemsElements = this.headerItems.map(element => <th key={element}>{element}</th>);
        const items = programersArr.map(element => (
            <tr key={element.id}>
                <td>{element.name}</td>
                <td>{element.email}</td>
                <td>{!!element.status ? <div className="access_container">Admin</div> : <div>-</div>}</td>
            </tr>
        ));

        return (
            <div className="wrapper_team_page">
                {checkAuthentication()}
                {this.props.createUserModal && (
                    <AddToTeamModal
                        programersArr={this.props.programersArr}
                        teamPageAction={this.props.teamPageAction}
                    />
                )}
                <LeftBar />
                <div className="data_container_team_page">
                    <div className="team_page_header">
                        <div className="page_name">Team</div>
                        <div className="invite_container">
                            {this.canAddToTeam(this.state.activeEmail) && (
                                <button
                                    onClick={e => {
                                        this.openAddUserModal();
                                    }}
                                >
                                    Add to team
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="team_page_data">
                        <table>
                            <thead>
                                <tr>{headerItemsElements}</tr>
                            </thead>
                            <tbody>{items}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({ activeEmail: localStorage.getItem('active_email') });
        client.request(getTeamData).then(data => {
            this.props.teamPageAction('SET_TABLE_DATA', { programersArr: data.team });
        });
    }
}

const mapStateToProps = store => {
    return {
        programersArr: store.teamPageReducer.programersArr,
        createUserModal: store.teamPageReducer.createUserModal,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        teamPageAction: (actionType, action) => dispatch(teamPageAction(actionType, action))[1],
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamPage);
