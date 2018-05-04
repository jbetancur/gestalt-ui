import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Card, CardContent } from 'components/Cards';
import { Checkbox } from 'react-md';
import { Button } from 'components/Buttons';
import { H1 } from 'components/Typography';
import { FullPageFooter } from 'components/FullPage';
import Label from 'components/Label';
import Log from 'components/Log';

class Upgrade extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    upgrade: PropTypes.object.isRequired,
    deleteUpgrade: PropTypes.func.isRequired,
    getUpgraderLog: PropTypes.func.isRequired,
    pollUpgraderLog: PropTypes.func.isRequired,
    pollUpgraderStatus: PropTypes.func.isRequired,
    log: PropTypes.array.isRequired,
    upgraderInstance: PropTypes.func.isRequired,
    clearPollLog: PropTypes.func.isRequired,
    clearAllPolling: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: {},
  };

  state = {
    debug: false,
    rollback: false,
  };

  componentDidMount() {
    this.props.pollUpgraderStatus();
    this.props.getUpgraderLog();
    this.props.pollUpgraderLog();
  }


  setStatus() {
    if (this.props.status.isRunning) return 'Upgrading';

    if (this.props.status.isComplete) return 'Upgrade Complete';

    if (this.props.status.isFailed) return 'Upgrade Failed';

    return null;
  }

  handleStop = () => {
    this.props.clearAllPolling();
    this.props.upgraderInstance('stop', { rollback: this.state.rollback });
  }

  handleDebugMode = (value) => {
    this.setState({ debug: value });
    this.props.clearPollLog();
    this.props.pollUpgraderLog({ debug: value });
  }

  handleRollback = (value) => {
    this.setState({ rollback: value });
  }

  render() {
    return (
      <Row center gutter={10}>
        <Col flex={6} xs={12} sm={12}>
          <Card>
            <CardContent>
              <Row gutter={5}>
                <H1>Upgrade Status</H1>

                <Col flex={12}>
                  <Label>Status: </Label>
                  <span>{this.setStatus()}</span>
                </Col>

                <Col flex={12}>
                  <span>{this.props.upgrade.endpoint}</span>
                </Col>
              </Row>
            </CardContent>

            <Row justifyContent="flex-end" style={{ paddingRight: '16px' }}>
              <Checkbox
                id="checkbox-debug"
                type="checkbox"
                label="Verbose Mode"
                name="debug"
                onChange={this.handleDebugMode}
                value={this.state.debug}
              />

              <Checkbox
                id="checkbox-rollback"
                type="checkbox"
                label="Rollback on Abort"
                name="rollback"
                onChange={this.handleRollback}
                value={this.state.rollback}
              />
            </Row>

            <Row>
              <Col flex={12}>
                <Log logItems={this.props.log} />
              </Col>
            </Row>
          </Card>

          <FullPageFooter
            fullWidth
            leftActions={
              <Button flat primary onClick={this.props.deleteUpgrade}>
                Remove Upgrader
              </Button>}
            rightActions={
              <Button raised primary onClick={this.handleStop}>
                Abort Upgrade
              </Button>
            }
          />
        </Col>
      </Row>
    );
  }
}

export default Upgrade;
