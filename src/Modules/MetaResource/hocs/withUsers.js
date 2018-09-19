import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default ({ unload = true } = {}) => (BaseComponent) => {
  class Users extends Component {
    static displayName = 'Users (HOC)';

    static propTypes = {
      usersActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      if (unload) {
        const { usersActions } = this.props;

        usersActions.unloadUsers();
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    users: state.users.users.users,
    usersPending: state.users.users.pending,
  });

  const mapDispatchToProps = dispatch => ({
    usersActions: bindActionCreators(Object.assign({},
      createRequestAction(['fetch', 'delete'], 'Users'),
      createRequestAction(['delete'], 'User'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Users);
};
