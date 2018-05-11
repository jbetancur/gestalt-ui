import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Card, CardContent } from 'components/Cards';
import { Button } from 'components/Buttons';
import { H1 } from 'components/Typography';
import { FullPageFooter } from 'components/FullPage';
import Label from 'components/Label';
import Log from 'components/Log';
import Div from 'components/Div';

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
    loading: PropTypes.bool.isRequired,
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
      <div>
        <Div disabled={this.props.loading} paddingBottom="56px">
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
        </Div>

        <FullPageFooter
          fullWidth
          leftActions={
            <Button primary flat onClick={this.props.deleteUpgrade}>
              Remove Upgrader
            </Button>
          }
          rightActions={
            <React.Fragment>
              <Button primary flat onClick={() => this.handleRecompute()} disabled={this.props.loading}>
                Recompute Plan
              </Button>

              <Button raised primary onClick={this.handleStart} disabled={this.props.loading}>
                Start Upgrade
              </Button>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}

export default Plan;
