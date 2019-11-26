import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

// dependencies
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

import { getDateInString } from '../../services/timeService';

// Components
import { Loading } from '../../components/Loading';
import TaskListItem from '../../components/TaskListItem';
import AddTask from '../../components/AddTask';
import StartTaskMobile from '../../components/StartTaskMobile';
import TutorialComponent from '../../components/TutorialComponent';

// Actions
import {
    getTimeEntriesListAction,
    incPaginationAction,
    getTimeEntriesListPaginationAction,
    restorePaginationAction,
} from '../../actions/MainPageAction';
import { getProjectsListActions } from '../../actions/ProjectsActions';

// Styles
import './style.scss';

class MainPage extends Component {
    state = {
        isInitialFetching: true,
    };

    splitTimersByDay = (timers = []) => {
        const formattedLogsDates = [];
        const formattedLogsDatesValues = [];

        for (let i = 0; i < timers.length; i++) {
            const date = moment(timers[i].startDatetime).format('YYYY-MM-DD');
            let index = formattedLogsDates.indexOf(date);
            if (index === -1) {
                formattedLogsDates.push(date);
                index = formattedLogsDates.length - 1;
            }

            if (typeof formattedLogsDatesValues[index] === 'undefined') {
                formattedLogsDatesValues[index] = [];
            }

            formattedLogsDatesValues[index].push(timers[i]);
        }
        return formattedLogsDatesValues;
    };

    renderDayDateString = date => {
        const { dateFormat, vocabulary } = this.props;
        const { lang } = vocabulary;
        const toUpperCaseFirstLetter = date => {
            const day = moment(date)
                .locale(lang.short)
                .format('dddd');
            return day[0].toUpperCase() + day.slice(1);
        };
        return `${toUpperCaseFirstLetter(date)}, ${moment(date).format(dateFormat)}`;
    };

    renderTotalTimeByDay = timers => {
        const { durationTimeFormat } = this.props;
        let totalTime = 0;
        for (let i = 0; i < timers.length; i++) {
            totalTime += +moment(timers[i].endDatetime) - +moment(timers[i].startDatetime);
        }

        return getDateInString(totalTime, durationTimeFormat);
    };

    handleScrollFrame = values => {
        const {
            incPaginationAction,
            isFetchingTimeEntriesList,
            getTimeEntriesListPaginationAction,
            pagination,
        } = this.props;
        const { top } = values;
        if (top > 0.7) {
            if (!isFetchingTimeEntriesList && !pagination.disabled) {
                incPaginationAction();
                getTimeEntriesListPaginationAction();
            }
        }
    };

    async componentDidMount() {
        const { getTimeEntriesListAction, getProjectsListActions } = this.props;
        await getTimeEntriesListAction();
        await getProjectsListActions();
        this.setState({
            isInitialFetching: false,
        });
    }

    componentWillUnmount() {
        const { restorePaginationAction } = this.props;
        restorePaginationAction();
    }

    render() {
        const {
            isMobile,
            vocabulary,
            timeEntriesList,
            currentTimer,
            isFetchingTimeEntriesList,
            pagination,
        } = this.props;
        const { v_total_time } = vocabulary;
        const { isInitialFetching } = this.state;

        return (
            <Loading flag={isInitialFetching} mode="parentSize" withLogo={false}>
                <TutorialComponent>
                    <div
                        className={classNames('main-page', {
                            'main-page--mobile': isMobile,
                        })}
                    >
                        <AddTask />
                        <Scrollbars onScrollFrame={this.handleScrollFrame}>
                            <div className="main-page__list">
                                {this.splitTimersByDay(timeEntriesList).map((day, index, arr) => (
                                    <div
                                        className={classNames('main-page__day', {
                                            'main-page__day--last-child': index === arr.length - 1,
                                        })}
                                        key={index}
                                    >
                                        <div className="main-page__day-header">
                                            <div className="main-page__day-date">
                                                {this.renderDayDateString(day[0].startDatetime)}
                                            </div>
                                            <div className="main-page__day-date-all-time">
                                                {v_total_time}: {this.renderTotalTimeByDay(day)}
                                            </div>
                                        </div>
                                        {day.map(task => (
                                            <TaskListItem key={task.id} task={task} />
                                        ))}
                                    </div>
                                ))}
                                {isFetchingTimeEntriesList && (
                                    <Loading
                                        mode="overlay"
                                        withLogo={false}
                                        flag={isFetchingTimeEntriesList}
                                        width="100%"
                                        height="100%"
                                    >
                                        <div className="main-page__lazy-load-spinner" />
                                    </Loading>
                                )}
                                {isMobile &&
                                    !currentTimer &&
                                    pagination.disabled && <div className="main-page__empty-block" />}
                            </div>
                        </Scrollbars>
                        <StartTaskMobile />
                    </div>
                </TutorialComponent>
            </Loading>
        );
    }
}

const mapStateToProps = state => ({
    timeEntriesList: state.mainPageReducer.timeEntriesList,
    isMobile: state.responsiveReducer.isMobile,
    user: state.userReducer.user,
    dateFormat: state.userReducer.dateFormat,
    durationTimeFormat: state.userReducer.durationTimeFormat,
    currentTimer: state.mainPageReducer.currentTimer,
    pagination: state.mainPageReducer.pagination,
    isFetchingTimeEntriesList: state.mainPageReducer.isFetchingTimeEntriesList,
});

const mapDispatchToProps = {
    getTimeEntriesListAction,
    getProjectsListActions,
    incPaginationAction,
    getTimeEntriesListPaginationAction,
    restorePaginationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);
