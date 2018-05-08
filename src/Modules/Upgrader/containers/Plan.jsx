import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Card, CardContent } from 'components/Cards';
import { Button } from 'components/Buttons';
import { H1 } from 'components/Typography';
import { FullPageFooter } from 'components/FullPage';
import Label from 'components/Label';
import Log from 'components/Log';

class Plan extends Component {
  static propTypes = {
    upgrade: PropTypes.object.isRequired,
    deleteUpgrade: PropTypes.func.isRequired,
    getPlan: PropTypes.func.isRequired,
    pollPlan: PropTypes.func.isRequired,
    pollInitUpgraderStatus: PropTypes.func.isRequired,
    pollUpgraderStatus: PropTypes.func.isRequired,
    plan: PropTypes.array.isRequired,
    recomputePlan: PropTypes.func.isRequired,
    upgraderInstance: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: {},
  };

  async componentDidMount() {
    await this.props.pollInitUpgraderStatus();
    await this.props.getPlan();

    if (!this.props.plan.length) {
      await this.props.recomputePlan();
      await this.props.pollPlan();
    }
  }

  async handleRecompute() {
    await this.props.recomputePlan();
    await this.props.pollPlan();
  }

  handleStart = () => {
    const { upgraderInstance } = this.props;

    upgraderInstance('start', { permissive: true });
    this.props.pollUpgraderStatus();
  }

  render() {
    return (
      <Row center gutter={10}>
        <Col flex={6} xs={12} sm={12}>
          <Card>
            <CardContent>
              <Row gutter={5}>
                <H1>Upgrade Plan</H1>

                <Col flex={12}>
                  <Label>Status: </Label>
                  <span>{this.props.plan.length ? 'Ready' : 'Calculating Plan... This may take awhile...'}</span>
                </Col>

                <Col flex={12}>
                  <span>{this.props.upgrade.endpoint}</span>
                </Col>
              </Row>
            </CardContent>


            <Row>
              <Col flex={12}>
                <Log logItems={this.props.plan} />
              </Col>
            </Row>
          </Card>
          <FullPageFooter
            fullWidth
            leftActions={
              <Button primary flat onClick={this.props.deleteUpgrade}>
                Remove Upgrader
              </Button>
            }
            rightActions={
              <React.Fragment>
                <Button primary flat onClick={() => this.handleRecompute()}>
                  Recompute Plan
                </Button>

                <Button raised primary onClick={this.handleStart}>
                  Start Upgrade
                </Button>
              </React.Fragment>
            }
          />
        </Col>
      </Row>
    );
  }
}

export default Plan;
