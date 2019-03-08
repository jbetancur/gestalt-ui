import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ActivityContainer } from 'components/ProgressIndicators';
import { Row, Col } from 'react-flexybox';
import { ErrorMessage } from 'components/Error';
import withUpgraderAPI from '../hocs/withUpgraderAPI';
import Launch from './Launch';
import Plan from './Plan';
import Upgrade from './Upgrade';

const UpgradeWrapper = styled.div`
  padding-top: 64px;
  height: 100%;
  background-color: ${props => props.theme.colors.background};
`;


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

    return <Launch {...this.props} />;
  }

  render() {
    return (
      <React.Fragment>
        <ErrorMessage visible={!!this.props.error} message={this.props.error} />
        {this.props.loading && <ActivityContainer id="uprader-loading" primary />}
        <UpgradeWrapper>
          <Row center gutter={10}>
            <Col flex={7} xs={12} sm={12} md={10}>
              {this.renderView()}
            </Col>
          </Row>
        </UpgradeWrapper>
      </React.Fragment>
    );
  }
}

export default compose(
  withUpgraderAPI,
)(UpgradeRouter);
