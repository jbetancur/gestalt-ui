import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  text-align: center;
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
  height: 100%;

  > [type=button] {
    margin: 5px;
  }
`;

const Message = styled(Title)`
  padding: 16px 8px 8px 8px;
`;

const NoData = ({ match, message, icon, createPath, createLabel, showCreate, showSecondaryCreate, secondaryCreateLabel, secondaryCreatePath }) => (
  <NoDataContainer>
    <IconWaterMark>
      {icon}
    </IconWaterMark>
    <Message light>
      {message}
    </Message>
    {showCreate &&
    <NoDataWrapper>
      <Button
        raised
        primary
        component={Link}
        to={createPath || `${match.url}/create`}
      >
        {createLabel}
      </Button>
      {showSecondaryCreate &&
        <Button
          raised
          primary
          component={Link}
          to={secondaryCreatePath || `${match.url}/create`}
        >
          {secondaryCreateLabel}
        </Button>}
    </NoDataWrapper>}
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
  createPath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showCreate: PropTypes.bool,
  createLabel: PropTypes.string,
  showSecondaryCreate: PropTypes.bool,
  secondaryCreateLabel: PropTypes.string,
  secondaryCreatePath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

NoData.defaultProps = {
  createPath: null,
  showCreate: true,
  createLabel: 'Create One',
  showSecondaryCreate: false,
  secondaryCreateLabel: 'Create One',
  secondaryCreatePath: null,
};

export default withRouter(NoData);
