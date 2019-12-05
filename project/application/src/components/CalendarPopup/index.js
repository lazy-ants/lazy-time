import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import { DatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import enLocale from 'date-fns/locale/en-GB';
import deLocale from 'date-fns/locale/de';
import ruLocale from 'date-fns/locale/ru';
import itLocale from 'date-fns/locale/it';
import uaLocale from 'date-fns/locale/uk';

// Actions
import { showNotificationAction } from '../../actions/NotificationActions';

import './style.scss';

const localeMap = {
    en: enLocale,
    ru: ruLocale,
    de: deLocale,
    it: itLocale,
    uk: uaLocale,
};

const muiTheme = createMuiTheme({
    overrides: {
        MuiFormHelperText: {
            root: {
                display: 'none',
            },
        },
        MuiTypography: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiInputAdornment: {
            root: {
                display: 'none',
            },
        },
        MuiInput: {
            root: {
                fontSize: '1.7rem !important',
            },
        },
        MuiFormControl: {
            root: {
                width: '100%',
            },
        },
        MuiPickersDay: {
            current: {
                color: '#27ae60',
            },
            daySelected: {
                backgroundColor: '#27ae60',
                '&:hover': {
                    backgroundColor: '#27ae60',
                },
            },
        },
    },
});

class CalendarPopup extends Component {
    state = {
        startDateTime: null,
        endDateTime: null,
        date: null,
        isChanged: false,
        initialRender: true,
    };

    static getDerivedStateFromProps(props, state) {
        const { startDateTime, endDateTime } = props;
        const { initialRender } = state;
        if (initialRender) {
            return {
                startDateTime: moment(startDateTime).toDate(),
                endDateTime: moment(endDateTime).toDate(),
                date: moment(startDateTime).toDate(),
                initialRender: false,
            };
        }
        return null;
    }

    changeHandlerStartTime = startTime => {
        this.setState({
            isChanged: true,
            startDateTime: startTime,
        });
    };

    changeHandlerEndTime = endTime => {
        this.setState({
            isChanged: true,
            endDateTime: endTime,
        });
    };

    changeHandlerDate = date => {
        this.setState({
            isChanged: true,
            date,
        });
    };

    componentDidMount() {
        const { createRefCallback } = this.props;
        createRefCallback(this.editTaskPopupRef);
    }

    componentDidUpdate(prevProps, prevState) {
        const { createRefCallback } = this.props;
        createRefCallback(this.editTaskPopupRef);
    }

    componentWillUnmount() {
        const { updateTask, vocabulary, showNotificationAction } = this.props;
        const { v_a_time_start_error } = vocabulary;
        const { startDateTime, endDateTime, date, isChanged } = this.state;
        if (isChanged) {
            if (moment(startDateTime).isValid() && moment(endDateTime).isValid()) {
                const startDay = moment(date).format('YYYY-MM-DD');
                let endDay = moment(date).format('YYYY-MM-DD');
                const startTime = moment(`${startDay} ${moment(startDateTime).format('HH:mm')}`);
                let endTime = moment(`${endDay} ${moment(endDateTime).format('HH:mm')}`);
                if (+startTime >= +endTime) {
                    endDay = moment(date)
                        .add(1, 'days')
                        .format('YYYY-MM-DD');
                    endTime = moment(`${endDay} ${moment(endDateTime).format('HH:mm')}`);
                }
                updateTask({
                    startDateTime: startTime,
                    endDateTime: endTime,
                });
            } else {
                showNotificationAction({ text: v_a_time_start_error, type: 'warning' });
            }
        }
    }

    render() {
        const { startDateTime, endDateTime, date } = this.state;
        const { timeFormat, vocabulary, firstDayOfWeek } = this.props;
        const { lang, v_time_start, v_time_end } = vocabulary;

        const customLocale = localeMap[lang.short];
        customLocale.options.weekStartsOn = firstDayOfWeek;

        return (
            <div ref={(this.editTaskPopupRef = React.createRef())} className="edit-task-popup">
                <ThemeProvider theme={muiTheme}>
                    <div className="edit-task-popup_set-time">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
                            <div className="edit-task-popup_set-time-start">
                                <div className="edit-task-popup_set-time-label">{v_time_start}</div>
                                <KeyboardTimePicker
                                    disableToolbar
                                    ampm={timeFormat === '12'}
                                    value={startDateTime}
                                    onChange={this.changeHandlerStartTime}
                                />
                            </div>
                            <div className="edit-task-popup_set-time-end">
                                <div className="edit-task-popup_set-time-label">{v_time_end}</div>
                                <KeyboardTimePicker
                                    disableToolbar
                                    ampm={timeFormat === '12'}
                                    value={endDateTime}
                                    onChange={this.changeHandlerEndTime}
                                />
                            </div>
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="edit-task-popup_calendar">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={customLocale}>
                            <DatePicker
                                autoOk
                                disableToolbar={true}
                                allowKeyboardControl={false}
                                variant="static"
                                openTo="date"
                                value={date}
                                onChange={this.changeHandlerDate}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </ThemeProvider>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
    timeFormat: state.userReducer.timeFormat,
    firstDayOfWeek: state.userReducer.firstDayOfWeek,
});

const mapDispatchToProps = {
    showNotificationAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPopup);
