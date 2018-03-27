import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';

const NoDataContainer = styled.div`
  position: relative;
`;

const IconWaterMark = styled.div`
  text-align: center;
  opacity: 0.1;
  padding-top: 8px;
`;

const NoDataWrapper = styled.div`
  text-align: center;
  padding: 24px;
`;

const NoData = ({ match, message, icon }) => (
  <NoDataContainer>
    <IconWaterMark>
      {icon}
    </IconWaterMark>
    <Title>
      {message}
    </Title>
    <NoDataWrapper>
      <Button
        raised
        primary
        component={Link}
        to={`${match.url}/create`}
      >
        Create One
      </Button>
    </NoDataWrapper>
  </NoDataContainer>

);

NoData.propTypes = {
  match: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

export default withRouter(NoData);
