import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

// Services

// Components

// Actions

// Queries

// Config

// Styles
import './style.css';

class ProjectSearchBar extends Component {
    etalonTable = [];

    search() {
        if (this.searchInput.value.length) {
            let afterSearch = this.props.etalonArr.filter(
                obj => obj.name.toLowerCase().indexOf(this.searchInput.value.toLowerCase().trim()) !== -1
            );
            this.props.projectsPageAction('CHANGE_ARR', { tableData: afterSearch });
        } else {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    setDefaultArr() {
        if (this.searchInput.value.length < 1) {
            this.props.projectsPageAction('CHANGE_ARR', { tableData: this.props.etalonArr });
        }
    }

    render() {
        const { vocabulary } = this.props;
        const { v_apply } = vocabulary;
        return (
            <div className="wrapper_project_search_bar">
                <div className="project_search_bar_search_field_container">
                    <i className="magnifer" />
                    <input
                        onChange={e => this.setDefaultArr()}
                        type="text"
                        onKeyUp={e => (e.keyCode === 13 ? this.search() : null)}
                        ref={input => (this.searchInput = input)}
                        className="project_search_bar_search_field"
                    />
                </div>
                <div className="project_search_bar_button_container">
                    <button className="project_search_bar_button" onClick={e => this.search()}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }
}

ProjectSearchBar.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ProjectSearchBar);
