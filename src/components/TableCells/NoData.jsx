import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';

const NoDataContainer = styled.div`
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
`;

const TitleStyled = styled(Title)`
  padding-top: 16px;
`;

const NoData = ({ match, message, icon, createPath, showCreate }) => (
  <NoDataContainer>
    <IconWaterMark>
      {icon}
    </IconWaterMark>
    <TitleStyled light>
      {message}
    </TitleStyled>
    {showCreate &&
    <NoDataWrapper>
      <Button
        raised
        primary
        component={Link}
        to={createPath || `${match.url}/create`}
      >
        Create One
      </Button>
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
};

NoData.defaultProps = {
  createPath: null,
  showCreate: true,
};

export default withRouter(NoData);
