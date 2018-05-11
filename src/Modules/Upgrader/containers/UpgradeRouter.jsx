import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { ActivityContainer } from 'components/ProgressIndicators';
import Div from 'components/Div';
import { Row, Col } from 'react-flexybox';
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
    deleteUpgrade: PropTypes.func.isRequired,
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
        <ErrorMessage visible={!!this.props.error} message={this.props.error} />
        {this.props.loading && <ActivityContainer id="uprader-loading" primary />}
        <Div paddingTop="64px">
          <Row center gutter={10}>
            <Col flex={7} xs={12} sm={12} md={10}>
              {this.renderView()}
            </Col>
          </Row>
        </Div>
      </React.Fragment>
    );
  }
}

export default compose(
  withUpgraderAPI,
)(UpgradeRouter);
