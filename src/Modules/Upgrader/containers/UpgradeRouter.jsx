import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { ActivityContainer } from 'components/ProgressIndicators';
import Div from 'components/Div';
import { ErrorMessage } from 'components/Error';
import withUpgraderAPI from '../withUpgraderAPI';
import Launch from './Launch';
import Plan from './Plan';
import Upgrade from './Upgrade';

class UpgradeRouter extends Component {
  static propTypes = {
    upgrade: PropTypes.object.isRequired,
    status: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    init: PropTypes.bool.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
  };

  renderView() {
    if (this.props.init) {
      if (!this.props.upgrade.active && !this.props.upgrade.endpoint) {
        return <Launch {...this.props} />;
      }

      if (this.props.upgrade.active && this.props.upgrade.endpoint) {
        if (this.props.status.isRunning) {
          return <Upgrade {...this.props} />;
        }

        return <Plan {...this.props} />;
      }
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.loading && <ActivityContainer id="uprader-loading" primary />}
        <Div paddingTop="64px" disabled={this.props.loading}>
          <ErrorMessage visible={!!this.props.error} message={this.props.error} />
          {this.renderView()}
        </Div>
      </React.Fragment>
    );
  }
}

export default compose(
  withUpgraderAPI,
)(UpgradeRouter);
