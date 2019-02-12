import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import './style.css';
import LeftBar from '../../components/LeftBar';
import addTasks from '../../actions/MainPageAction';
import manualTimerModalAction from '../../actions/ManualTimerModalAction';
import ManualTimeModal from '../../components/Manual-time-modal';
import { client } from '../../requestSettings';
import {
    getTodayTimeEntries,
    returnMutationLinkAddTimeEntries,
    returnMutationLinkDeleteTimeEntries,
} from '../../queries';

class MainPage extends Component {
    state = {
        classToggle: true,
        intervalId: '',
        time: moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss'),
        date: moment().format('YYYY-MM-DD'),
        arrTasks: [],
    };
    time = {
        timeStart: '',
        timeFinish: '',
    };

    changeClass = () => {
        this.setState(state => ({
            classToggle: !state.classToggle,
        }));
        this.startTimer();
    };

    startTimer = () => {
        if (this.state.classToggle) {
            this.time.timeStart = moment().format('HH:mm:ss');
            this.state.intervalId = setInterval(() => {
                this.setState(state => ({
                    time: moment(state.time).add(1, 'second'),
                }));
            }, 1000);
        } else {
            let arr = this.props.arrTasks;
            clearInterval(this.state.intervalId);
            this.time.timeFinish = moment().format('HH:mm:ss');
            let object = {
                id: +new Date(),
                name: this.mainTaskName.value,
                date: this.state.date,
                timeFrom: this.time.timeStart,
                timeTo: this.time.timeFinish,
                timePassed: moment(this.state.time).format('HH:mm:ss'),
                userId: 1,
                project: 'any',
            };
            arr.push(object);
            client.request(returnMutationLinkAddTimeEntries(object)).then(data => {});
            this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: arr });
            this.cleanMainField();
        }
    };

    cleanMainField() {
        this.state.time = moment()
            .set({ hour: 0, minute: 0, second: 0 })
            .format('YYYY-MM-DD HH:mm:ss');
        this.time.timeFinish = '';
        this.time.timeStart = '';
        this.mainTaskName.value = '';
    }

    deleteFromArr(item) {
        let newArr = [];
        for (let i = 0; i < this.props.arrTasks.length; i++) {
            if (this.props.arrTasks[i].id !== item.id) {
                newArr.push(this.props.arrTasks[i]);
            }
        }
        client
            .request(returnMutationLinkDeleteTimeEntries(item))
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: newArr }));
    }

    startOldTask(oldTask) {
        this.mainTaskName.value = oldTask.name;
        this.changeClass();
    }

    componentWillMount() {
        this.setState({ arrTasks: this.props.arrTasks });
    }

    render() {
        const { classToggle } = this.state;
        const buttonState = classToggle ? 'play' : 'stop';
        const buttonClassName = ['control_task_time_icons', buttonState].join(' ');
        let items = this.props.arrTasks.map(item => (
            <div className="ul" key={item.id}>
                <div className="li">
                    <div className="name_container">
                        <div className="name">{item.name}</div>
                        <div className="project_name">{item.project}</div>
                    </div>
                    <div className="time_container_history">
                        <div className="time_now">
                            <div>{item.timeFrom}</div>-<div>{item.timeTo}</div>
                        </div>
                        <div className="timePassed">{item.timePassed}</div>
                        <i className="small_play" onClick={e => this.startOldTask(item)} />
                        <i
                            className="edit_button"
                            onClick={e => {
                                this.props.addTasksAction('SET_EDITED_ITEM', { editedItem: item });
                                this.props.manualTimerModalAction('TOGGLE_MODAL', { manualTimerModalToggle: true });
                            }}
                        />
                        <i className="cancel" onClick={e => this.deleteFromArr(item)} />
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="wrapper_main_page">
                {this.props.manualTimerModal.manualTimerModalToggle && (
                    <ManualTimeModal
                        manualTimerModalAction={this.props.manualTimerModalAction}
                        arrTasks={this.props.arrTasks}
                        editedItem={this.props.editedItem}
                    />
                )}
                <LeftBar />
                <div className="data_container">
                    <div className="add_task_container">
                        <input
                            type="text"
                            className="add_task"
                            placeholder="Add your task name"
                            ref={input => {
                                this.mainTaskName = input;
                            }}
                        />
                        <div className="time_container">{moment(this.state.time).format('HH:mm:ss')}</div>
                        <i className="folder" />
                        <i onClick={this.changeClass} className={buttonClassName} />
                    </div>
                    {items}
                </div>
            </div>
        );
    }

    componentDidMount() {
        client
            .request(getTodayTimeEntries)
            .then(data => this.props.addTasksAction('ADD_TASKS_ARR', { arrTasks: data.timeTracker }));
    }
}

const mapStateToProps = store => {
    return {
        arrTasks: store.mainPageReducer.arrTasks,
        editedItem: store.mainPageReducer.editedItem,
        manualTimerModal: store.manualTimerModalReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addTasksAction: (actionType, action) => dispatch(addTasks(actionType, action))[1],
        manualTimerModalAction: (actionType, action) => dispatch(manualTimerModalAction(actionType, action))[1],
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
