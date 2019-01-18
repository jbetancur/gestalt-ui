import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';
import actions from '../actions';

export default function withUpgrader(BaseComponent) {
  class Secret extends PureComponent {
    static displayName = 'Upgrader (HOC)';

    static propTypes = {
      upgraderActions: PropTypes.object.isRequired,
    };

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    upgradeAvailable: state.upgrader.upgrader.status,
    upgradeAvailablePending: state.upgrader.upgrader.pending,
  });

  const mapDispatchToProps = dispatch => ({
    upgraderActions: bindActionCreators(Object.assign({},
      actions,
      createRequestAction(['fetch'], 'UpgradeAvailable'),
    ), dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(Secret);
}
