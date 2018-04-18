import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from './actions';

export default function withlicense(BaseComponent) {
  class License extends Component {
    static displayName = 'License(HOC)';
    static propTypes = {
      licenseActions: PropTypes.object.isRequired,
    };

    componentWillUnmount() {
      const { licenseActions } = this.props;

      licenseActions.unloadLicense();
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    license: state.licensing.license.license,
    licensePending: state.licensing.license.pending,
  });

  const mapDispatchToProps = dispatch => ({
    licenseActions: bindActionCreators(actions, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(License);
}
