import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import withApp from 'App/hocs/withApp';
import HomeCard from '../components/HomeCard';
import homeItems from '../config/homeItems';
import iconMap from '../config/iconMap';

class EnvironmentHome extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    // appState: PropTypes.object.isRequired,
  };

  render() {
    const { match } = this.props;
    const items = homeItems(match.url);

    return (
      <Row gutter={5} center padding="5px" minColWidths={275}>
        {items.map(item => (
          <Col flex={2} xs={12} sm={6} md={4} key={item.key}>
            <HomeCard
              title={item.title}
              icon={iconMap(item.icon, 42)}
              iconColor={item.iconColor}
              iconGradient={item.iconGradient}
              createURL={item.createURL}
              manageURL={item.manageURL}
            >
              {item.description}
            </HomeCard>
          </Col>
        ))}
      </Row>
    );
  }
}

export default withApp(EnvironmentHome);
