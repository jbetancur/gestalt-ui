import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { LambdaIcon, ContainerIcon, APIIcon, SecretIcon, PolicyIcon, DataFeedIcon, StreamIcon } from 'components/Icons';
import withApp from 'App/withApp';
import HomeCard from '../components/HomeCard';
// import { DOCUMENTATION_URL } from '../../../constants';

class EnvironmentHome extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    // appState: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Row gutter={5} columnDivisions={25} center>
        <Col flex={6} xs={25} sm={20} md={10}>
          <HomeCard
            title="Lambdas"
            icon={<LambdaIcon size={42} />}
            iconColor="amber"
            iconGradient="500"
            createURL={`${this.props.match.url}/lambdas/create`}
            manageURL={`${this.props.match.url}/lambdas`}
            // documentationURL={`${DOCUMENTATION_URL}/overview/concepts/#lambdas`}
          >
            Create, manage and deploy Lambdas with support for a wide array of languages
          </HomeCard>
        </Col>

        <Col flex={6} xs={25} sm={20} md={10}>
          <HomeCard
            title="Containers"
            icon={<ContainerIcon size={42} />}
            iconColor="blue"
            iconGradient="700"
            createURL={`${this.props.match.url}/containers/create`}
            manageURL={`${this.props.match.url}/containers`}
            // documentationURL={`${DOCUMENTATION_URL}/overview/concepts/#containers`}
          >
            Create, manage and migrate Containers across Kubernetes, Swarm or DCOS
          </HomeCard>
        </Col>

        <Col flex={6} xs={25} sm={20} md={10}>
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

        <Col flex={6} xs={25} sm={20} md={10}>
          <HomeCard
            title="APIs"
            icon={<APIIcon size={42} />}
            iconColor="blue-grey"
            iconGradient="500"
            createURL={`${this.props.match.url}/apis/create`}
            manageURL={`${this.props.match.url}/apis`}
          >
            Upstream access to Lambdas/Containers can be defined through API endpoints
          </HomeCard>
        </Col>

        <Col flex={6} xs={25} sm={20} md={10}>
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

        <Col flex={6} xs={25} sm={20} md={10}>
          <HomeCard
            title="Data Feeds"
            icon={<DataFeedIcon size={42} />}
            iconColor="pink"
            iconGradient="300"
            createURL={`${this.props.match.url}/datafeeds/create`}
            manageURL={`${this.props.match.url}/datafeeds`}
          >
            Real-time Data Feeds
          </HomeCard>
        </Col>

        <Col flex={6} xs={25} sm={20} md={10}>
          <HomeCard
            title="Stream Specifications"
            icon={<StreamIcon size={42} />}
            iconColor="light-blue"
            iconGradient="500"
            createURL={`${this.props.match.url}/streamspecs/create`}
            manageURL={`${this.props.match.url}/streamspecs`}
          >
            Transform Data Feeds using a Lambda
          </HomeCard>
        </Col>
      </Row>
    );
  }
}

export default withApp(EnvironmentHome);
