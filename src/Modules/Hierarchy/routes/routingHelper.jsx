import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadStorage, saveStorage } from 'util/helpers/localstorage';

const getPreviousRoute = () => JSON.parse(loadStorage('lastVisitedRoute'));

export default function modalRouting(BaseComponent) {
  class ModalRouting extends Component {
    static propTypes = {
      location: PropTypes.object.isRequired,
    };

    componentWillUpdate(nextProps) {
      const { location } = this.props;
      // set previousLocation if props.location is not modal
      saveStorage('lastVisitedRoute', JSON.stringify(location));

      if (
        nextProps.history.action !== 'POP' &&
        (!location.state || !location.state.modal)
      ) {
        this.previousLocation = getPreviousRoute();
      }
    }

    previousLocation = getPreviousRoute();

    render() {
      const { location } = this.props;

      const isModal = !!(
        location.state &&
        location.state.modal &&
        this.previousLocation !== location // not initial render
      );

      return <BaseComponent isModal={isModal} previousLocation={this.previousLocation} {...this.props} />;
    }
  }

  // tap into redux router - experimental
  function mapStateToProps(state) {
    return {
      routing: state.routing,
    };
  }

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(ModalRouting);
}
