import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import moment from 'moment';

import _ from 'lodash';

// Actions
import { setSwipedTaskAction } from '../../actions/ResponsiveActions';
import { getTimeEntriesListAction } from '../../actions/MainPageAction';
import { showNotificationAction } from '../../actions/NotificationActions';

// Services
import { getTimeDurationByGivenTimestamp } from '../../services/timeService';
import { encodeTimeEntryIssue } from '../../services/timeEntryService';
import { sleep } from '../../services/sleep';
import { getUtcOffsetInMilliseconds } from '../../services/timeService';

// API
import { deleteTask, changeTask } from '../../configAPI';
import { startTimerSocket } from '../../configSocket';

// Components
import JiraIcon from '../JiraIcon';
import { Loading } from '../Loading';
import ProjectsListPopup from '../ProjectsListPopup';
import CustomSwipe from '../CustomSwipe';
import ModalPortal from '../ModalPortal';
import CalendarPopup from '../CalendarPopup';
import StartEditTaskModal from '../StartEditTaskModal';

// Styles
import './style.scss';

const PlayIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.3513 6.43723L1.92647 0.14824C1.64784 -0.0274411 1.30186 0.00182833 1.04056 0.00182833C-0.00463631 0.00182833 3.58597e-07 0.856458 3.58597e-07 1.07297V13.927C3.58597e-07 14.11 -0.00457534 14.9982 1.04056 14.9982C1.30186 14.9982 1.6479 15.0273 1.92647 14.8517L11.3513 8.56279C12.1248 8.07529 11.9912 7.49998 11.9912 7.49998C11.9912 7.49998 12.1249 6.92467 11.3513 6.43723Z"
            fill="#27ae60"
        />
    </svg>
);

const EditIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const DeleteIcon = ({ className, onClick }) => (
    <svg
        className={className}
        onClick={onClick}
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.28273 7.50004L14.6308 2.15198C15.1231 1.65968 15.1231 0.861516 14.6308 0.369292C14.1385 -0.123003 13.3404 -0.123003 12.8481 0.369292L7.49997 5.71742L2.15185 0.369221C1.65956 -0.123074 0.861463 -0.123074 0.369168 0.369221C-0.123056 0.861516 -0.123056 1.65968 0.369168 2.15191L5.71729 7.49996L0.369168 12.8481C-0.123056 13.3404 -0.123056 14.1386 0.369168 14.6308C0.861463 15.1231 1.65956 15.1231 2.15185 14.6308L7.49997 9.28265L12.8481 14.6308C13.3403 15.1231 14.1385 15.1231 14.6308 14.6308C15.1231 14.1385 15.1231 13.3404 14.6308 12.8481L9.28273 7.50004Z"
            fill="#EB5757"
        />
    </svg>
);

const TrashIcon = ({ className, onClick }) => (
    <svg className={className} onClick={onClick} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.11286 19.4171C3.11286 19.4171 3.4922 20.831 5.44478 20.831H14.2735C16.226 20.831 16.6053 19.4171 16.6053 19.4171L18.3483 5.55496H1.37001L3.11286 19.4171ZM13.2548 7.63809C13.2548 7.25456 13.6348 6.94374 14.1037 6.94374C14.5726 6.94374 14.9527 7.25456 14.9527 7.63809L14.1037 18.0536C14.1037 18.4371 13.7236 18.7479 13.2548 18.7479C12.786 18.7479 12.4059 18.437 12.4059 18.0536L13.2548 7.63809ZM9.01025 7.63809C9.01025 7.25456 9.39035 6.94374 9.85915 6.94374C10.328 6.94374 10.708 7.25456 10.708 7.63809V18.0536C10.708 18.4371 10.328 18.7479 9.85915 18.7479C9.39026 18.7479 9.01025 18.437 9.01025 18.0536V7.63809ZM5.61458 6.94366C6.08347 6.94366 6.46347 7.25449 6.46347 7.63801L7.31246 18.0535C7.31246 18.437 6.93236 18.7479 6.46347 18.7479C5.99468 18.7479 5.61458 18.437 5.61458 18.0535L4.76568 7.63809C4.76568 7.25456 5.14578 6.94366 5.61458 6.94366ZM17.8389 2.77857H14.1037V1.38878C14.1037 0.335343 13.6872 0 12.4059 0H7.31237C6.13716 0 5.61458 0.465616 5.61458 1.38878V2.77864H1.87941C1.12869 2.77864 0.521118 3.24473 0.521118 3.82067C0.521118 4.3967 1.12869 4.86278 1.87941 4.86278H17.8389C18.5896 4.86278 19.1972 4.3967 19.1972 3.82067C19.1972 3.24473 18.5896 2.77857 17.8389 2.77857ZM12.4059 2.77857H7.31246L7.31256 1.3887H12.406V2.77857H12.4059Z"
            fill="white"
        />
    </svg>
);

class TaskListItem extends Component {
    state = {
        isStartingTask: false,
        isUpdatingTask: false,
        isOpenCalendar: false,
        isOpenProjectsListPopup: false,
        isUpdatingIssue: false,
        isProjectAvailable: false,
        newIssue: '',
    };

    formatPeriodTime = time => {
        const { timeFormat } = this.props;
        const formattedTime = moment(time).format(`${timeFormat === '12' ? 'h:mm a' : 'HH:mm'}`);
        return formattedTime;
    };

    formatDurationTime = (startTime, endTime) => {
        const { durationTimeFormat } = this.props;
        const formattedTime = getTimeDurationByGivenTimestamp(
            +moment(endTime) - +moment(startTime),
            durationTimeFormat
        );
        return formattedTime;
    };

    deleteTask = async event => {
        const { vocabulary, task, getTimeEntriesListAction, setSwipedTaskAction, isMobile } = this.props;
        const { v_a_task_delete } = vocabulary;
        let check = window.confirm(v_a_task_delete);
        if (check) {
            if (isMobile) {
                setSwipedTaskAction(null);
                await sleep(1000);
            }
            this.setState({ isUpdatingTask: true });
            await deleteTask(task.id);
            getTimeEntriesListAction();
        }
    };

    updateTask = async ({ issue, projectId, startDateTime, endDateTime }) => {
        this.setState({ isUpdatingTask: true });
        const { task, getTimeEntriesListAction } = this.props;
        const { id, project, issue: initialIssue } = task;
        const data = {
            issue: issue ? encodeTimeEntryIssue(issue) : encodeTimeEntryIssue(initialIssue),
            projectId: projectId || project.id,
            timezoneOffset: getUtcOffsetInMilliseconds(),
        };
        if (startDateTime && endDateTime) {
            data.startDatetime = startDateTime.utc().toISOString();
            data.endDatetime = endDateTime.utc().toISOString();
        }
        await changeTask(id, data);
        await getTimeEntriesListAction();
        this.setState({ isUpdatingTask: false });
    };

    onChangeProject = project => {
        const { projectsList } = this.props;
        this.updateTask({ projectId: project.id });
        this.setState({ isProjectAvailable: !!projectsList.find(item => item.id === project.id) });
    };

    openCalendar = event => {
        const { v_project_not_available } = this.props.vocabulary;
        if (!this.state.isProjectAvailable) {
            this.props.showNotificationAction({
                text: v_project_not_available,
                type: 'warning',
            });
            return;
        }

        this.setState({
            isOpenCalendar: true,
        });
        document.addEventListener('mousedown', this.closeCalendar);
    };

    closeCalendar = event => {
        if (!this.popupEditTask.current.contains(event.target)) {
            this.setState({
                isOpenCalendar: false,
            });
            document.removeEventListener('mousedown', this.closeCalendar);
        }
    };

    setIsOpenProjectsListPopup = key => {
        this.setState({
            isOpenProjectsListPopup: key,
        });
    };

    createRefCallback = ref => {
        this.popupEditTask = ref;
    };

    startEditIssue = event => {
        const { isMobile } = this.props;

        if (isMobile) return;

        this.setState({
            isUpdatingIssue: true,
            newIssue: '',
        });
    };

    endEditIssue = async event => {
        const { isMobile, task } = this.props;
        if (isMobile) return;
        const { newIssue } = this.state;
        if (newIssue.trim() && newIssue.trim() !== task.issue) {
            await this.updateTask({ issue: newIssue.trim() });
        } else {
            event.target.textContent = task.issue;
            event.target.scroll(0, 0);
        }
        this.setState({
            isUpdatingIssue: false,
        });
    };

    setCaretPosition = (elem, position) => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(elem.childNodes[0], position);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    handlePaste = event => {
        const { cursorPosition } = this.state;
        const elem = event.target;
        const currentValue = elem.textContent;
        const splitted = currentValue.split('');
        const lengthOfSelected = cursorPosition[1] - cursorPosition[0];
        const clipboardData = event.clipboardData.getData('text/plain') || window.clipboardData.getData('text');
        splitted.splice(cursorPosition[0], lengthOfSelected, clipboardData);
        elem.textContent = splitted.join('');
        const newCursorPosition = cursorPosition[0] + clipboardData.length;
        this.setCaretPosition(elem, newCursorPosition);
        this.setCaretPositionToState();
        this.setState({
            newIssue: event.target.textContent,
        });
        event.preventDefault();
    };

    setCaretPositionToState = event => {
        const { isMobile, vocabulary } = this.props;
        const { v_project_not_available } = vocabulary;
        if (isMobile) return;

        if (!this.state.isProjectAvailable) {
            this.props.showNotificationAction({
                text: v_project_not_available,
                type: 'warning',
            });
            return;
        }

        const sel = window.getSelection();
        if (sel.anchorOffset <= sel.focusOffset) {
            this.setState({
                cursorPosition: [sel.anchorOffset, sel.focusOffset],
            });
        } else {
            this.setState({
                cursorPosition: [sel.focusOffset, sel.anchorOffset],
            });
        }
    };

    handleStartTimer = event => {
        const { task, vocabulary } = this.props;
        const { v_project_not_available } = vocabulary;
        const { issue, project } = task;

        if (!this.state.isProjectAvailable) {
            this.props.showNotificationAction({
                text: v_project_not_available,
                type: 'warning',
            });
            return;
        }

        this.setState(
            {
                isStartingTask: true,
            },
            () => startTimerSocket({ issue, projectId: project.id })
        );
    };

    handleSwipeMove = ({ x, y }, event) => {
        const { setSwipedTaskAction, task, viewport, swipedTask } = this.props;
        if (y <= 20 || x >= -20) {
            if (x <= -(viewport.width / 15) && swipedTask !== task.id) {
                setSwipedTaskAction(task.id);
            } else if (x >= viewport.width / 15 && swipedTask === task.id) {
                setSwipedTaskAction(null);
            }
        }
    };

    openEditTaskModal = event => {
        const { setSwipedTaskAction } = this.props;
        this.setState({
            showEditModal: true,
        });
        setSwipedTaskAction(null);
    };

    closeEditTaskModal = event => {
        this.setState({
            showEditModal: false,
        });
    };

    componentDidMount() {
        const { projectsList, task } = this.props;
        const { project } = task;
        this.setState({ isProjectAvailable: !!projectsList.find(item => item.id === project.id) });
    }

    componentDidUpdate(prevProps, prevState) {
        const { isUpdatingTask, isStartingTask } = this.state;
        const { timeEntriesList, currentTimer } = this.props;
        if (!_.isEqual(timeEntriesList, prevProps.timeEntriesList) && isUpdatingTask) {
            this.setState({ isUpdatingTask: false });
        }

        if (!_.isEqual(prevProps.currentTimer, currentTimer) && isStartingTask) {
            this.setState({ isStartingTask: false });
        }
    }

    render() {
        const {
            isUpdatingTask,
            isOpenCalendar,
            isOpenProjectsListPopup,
            isUpdatingIssue,
            newIssue,
            isStartingTask,
            showEditModal,
            isProjectAvailable,
        } = this.state;
        const { task, isMobile, vocabulary, swipedTask } = this.props;
        const { v_edit_task, v_delete_task } = vocabulary;
        const { issue, project, syncJiraStatus, startDatetime, endDatetime, id } = task;

        return (
            <CustomSwipe
                className={classNames('task-item-swipe', {
                    'task-item-swipe--swiped': swipedTask === id,
                })}
                onSwipeMove={this.handleSwipeMove}
            >
                <div
                    className={classNames('task-item', {
                        'task-item--mobile': isMobile,
                        'task-item--disabled': isUpdatingTask,
                        'task-item--selected':
                            isOpenCalendar || isOpenProjectsListPopup || isUpdatingIssue || isStartingTask,
                    })}
                >
                    <Loading mode="overlay" flag={isUpdatingTask || isStartingTask} withLogo={false}>
                        <JiraIcon
                            task={task}
                            isSync={syncJiraStatus}
                            disableClick={isOpenCalendar || isUpdatingIssue}
                        />
                        <p
                            className={classNames('task-item__issue', {
                                'task-item__issue--editing': isUpdatingIssue,
                            })}
                            spellCheck={false}
                            contentEditable={!isMobile && isProjectAvailable}
                            suppressContentEditableWarning={true}
                            onKeyUp={this.setCaretPositionToState}
                            onClick={this.setCaretPositionToState}
                            onKeyDown={event => {
                                this.setCaretPositionToState();
                                event.keyCode === 13 && event.target.blur();
                            }}
                            onFocus={this.startEditIssue}
                            onBlur={this.endEditIssue}
                            onInput={event => {
                                this.setState({
                                    newIssue: event.target.textContent,
                                });
                            }}
                            onPaste={this.handlePaste}
                        >
                            {isUpdatingTask && newIssue ? newIssue : issue}
                        </p>
                        <ProjectsListPopup
                            disabled={isMobile}
                            onChangeVisibility={this.setIsOpenProjectsListPopup}
                            listItem
                            onChange={this.onChangeProject}
                            selectedProject={project}
                        />
                        <p className="task-item__period-time">
                            <span className="task-item__start-time">{this.formatPeriodTime(startDatetime)}</span>
                            {' - '}
                            <span className="task-item__end-time">{this.formatPeriodTime(endDatetime)}</span>
                        </p>
                        {!isMobile && (
                            <p className="task-item__duration-time">
                                {this.formatDurationTime(startDatetime, endDatetime)}
                            </p>
                        )}
                        <div className="task-item__edit-wrapper">
                            {isMobile && (
                                <p className="task-item__duration-time-mobile">
                                    {this.formatDurationTime(startDatetime, endDatetime)}
                                </p>
                            )}
                            <PlayIcon className="task-item__play-icon" onClick={this.handleStartTimer} />
                            <EditIcon className="task-item__edit-icon" onClick={this.openCalendar} />
                            <DeleteIcon className="task-item__delete-icon" onClick={this.deleteTask} />
                            {isOpenCalendar && (
                                <CalendarPopup
                                    createRefCallback={this.createRefCallback}
                                    startDateTime={startDatetime}
                                    endDateTime={endDatetime}
                                    updateTask={this.updateTask}
                                />
                            )}
                        </div>
                    </Loading>
                </div>
                {isMobile && (
                    <div className="task-item__bottom-layer">
                        <div className="task-item__bottom-layer-edit-button" onClick={this.openEditTaskModal}>
                            <EditIcon className="task-item__bottom-layer-edit-button-icon" />
                            <span className="task-item__bottom-layer-edit-button-text">{v_edit_task}</span>
                        </div>
                        <div className="task-item__bottom-layer-delete-button" onClick={this.deleteTask}>
                            <TrashIcon className="task-item__bottom-layer-delete-button-icon" />
                            <span className="task-item__bottom-layer-delete-button-text">{v_delete_task}</span>
                        </div>
                    </div>
                )}
                {showEditModal && (
                    <ModalPortal>
                        <StartEditTaskModal editMode task={task} disableShowModal={this.closeEditTaskModal} />
                    </ModalPortal>
                )}
            </CustomSwipe>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    vocabulary: state.languageReducer.vocabulary,
    timeFormat: state.userReducer.timeFormat,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    timeEntriesList: state.mainPageReducer.timeEntriesList,
    projectsList: state.projectReducer.projectsList,
    currentTimer: state.mainPageReducer.currentTimer,
    isMobile: state.responsiveReducer.isMobile,
    viewport: state.responsiveReducer.viewport,
    swipedTask: state.responsiveReducer.swipedTask,
});

const mapDispatchToProps = {
    getTimeEntriesListAction,
    setSwipedTaskAction,
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskListItem);
