import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';

import HomeCard from './HomeCard';
import homeItems from '../config/homeItems';
import iconMap from '../config/iconMap';

const EnvironmentHome = ({ match }) => {
  const items = homeItems(match.url);

  return (
    <Row gutter={5} center padding="5px" minColWidths={275}>
      {items.map(item => (
        <Col flex={2} xs={12} sm={6} md={4} key={item.key}>
          <HomeCard
            title={item.title}
            icon={iconMap(item.icon, 32)}
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
};

EnvironmentHome.propTypes = {
  match: PropTypes.object.isRequired,
};

export default EnvironmentHome;
