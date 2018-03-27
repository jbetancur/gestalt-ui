import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { LambdaIcon, ContainerIcon, APIIcon, SecretIcon, PolicyIcon } from 'components/Icons';
import HomeCard from '../components/HomeCard';
// import { DOCUMENTATION_URL } from '../../../constants';

class EnvironmentHome extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  render() {
    return (
      <Row gutter={5} columnDivisions={25} center>
        <Col flex={5} xs={25} sm={20} md={10}>
          <HomeCard
            title="Lambdas"
            icon={<LambdaIcon size={42} />}
            iconColor="amber"
            iconGradient="500"
            createURL={`${this.props.match.url}/lambdas/create`}
            manageURL={`${this.props.match.url}/lambdas`}
            // documentationURL={`${DOCUMENTATION_URL}/overview/concepts/#lambdas`}
          >
            Create, manage and deploy lambdas with support for a wide array of languages
          </HomeCard>
        </Col>

        <Col flex={5} xs={25} sm={20} md={10}>
          <HomeCard
            title="Containers"
            icon={<ContainerIcon size={42} />}
            iconColor="blue"
            iconGradient="700"
            createURL={`${this.props.match.url}/containers/create`}
            manageURL={`${this.props.match.url}/containers`}
            // documentationURL={`${DOCUMENTATION_URL}/overview/concepts/#containers`}
          >
            Create, manage and migrate containers across Kubernetes, Swarm or DCOS
          </HomeCard>
        </Col>

        <Col flex={5} xs={25} sm={20} md={10}>
          <HomeCard
            title="Policies"
            icon={<PolicyIcon size={42} />}
            iconColor="green"
            iconGradient="500"
            createURL={`${this.props.match.url}/policies/create`}
            manageURL={`${this.props.match.url}/policies`}
            // documentationURL={`${DOCUMENTATION_URL}/overview/concepts/#policies`}
          >
            Keep infrastucture under control and/or leverage events that trigger custom actions
          </HomeCard>
        </Col>

        <Col flex={5} xs={25} sm={20} md={10}>
          <HomeCard
            title="APIs"
            icon={<APIIcon size={42} />}
            iconColor="blue-grey"
            iconGradient="500"
            createURL={`${this.props.match.url}/apis/create`}
            manageURL={`${this.props.match.url}/apis`}
          >
            Upstream access to lambdas/containers can be defined through API endpoints
          </HomeCard>
        </Col>

        <Col flex={5} xs={25} sm={20} md={10}>
          <HomeCard
            title="Secrets"
            icon={<SecretIcon size={42} />}
            iconColor="indigo"
            iconGradient="500"
            createURL={`${this.props.match.url}/secrets/create`}
            manageURL={`${this.props.match.url}/secrets`}
          >
            Secret are intended to hold sensitive information: passwords, OAuth tokens, and ssh keys
          </HomeCard>
        </Col>
      </Row>
    );
  }
}

export default EnvironmentHome;
