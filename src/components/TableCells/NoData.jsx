import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Title } from 'components/Typography';
import { FlatButton } from 'components/Buttons';

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

const NoData = ({ match, message, icon, showCreate, createPath, createLabel, showSecondaryCreate, secondaryCreateLabel, secondaryCreatePath }) => (
  <NoDataContainer>
    {icon && (
      <IconWaterMark>
        {icon}
      </IconWaterMark>
    )}
    <Message light>
      {message}
    </Message>
    {showCreate &&
    <NoDataWrapper>
      <FlatButton
        variant="contained"
        color="primary"
        component={Link}
        to={createPath || `${match.url}/create`}
        label={createLabel}
      />
      {showSecondaryCreate &&
        <FlatButton
          variant="contained"
          color="primary"
          component={Link}
          to={secondaryCreatePath || `${match.url}/create`}
          label={secondaryCreateLabel}
        />}
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
  ]),
  showCreate: PropTypes.bool,
  createPath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  createLabel: PropTypes.string,
  showSecondaryCreate: PropTypes.bool,
  secondaryCreateLabel: PropTypes.string,
  secondaryCreatePath: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

NoData.defaultProps = {
  icon: null,
  showCreate: true,
  createPath: null,
  createLabel: 'Create One',
  showSecondaryCreate: false,
  secondaryCreateLabel: 'Create One',
  secondaryCreatePath: null,
};

export default withRouter(NoData);
