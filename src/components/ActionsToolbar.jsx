import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import { Title, Caption } from 'components/Typography';
import { Button } from 'components/Buttons';

const ActionHeaderStyle = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 48px;
  width: 100%;
  padding: 6px;
`;

const BackAction = styled.div`
  flex: 0;
  padding-right: 8px;
  width: 48px;
  height: 100%;
`;

const Left = styled.div`
  flex: 1 1 auto;
  height: 100%;
`;

const IconStyle = styled.span`
  padding-right: 8px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1 1 auto;
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.5'};

  button,
  a {
    margin-left: 3px;
    font-size: 11px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;

const ActionsHeader = ({ title, subtitle, titleIcon, actions, showActions, showBackNav, navTo, disabled }) => (
  <ActionHeaderStyle>
    {showBackNav && navTo &&
      <BackAction>
        <Button
          icon
          component={Link}
          to={navTo}
        >
          arrow_back
        </Button>
      </BackAction>}

    <Left>
      <TitleSection>
        {!!titleIcon &&
        <IconStyle>
          {titleIcon}
        </IconStyle>}

        {!!title &&
          <Title>
            {title}
          </Title>}
      </TitleSection>
      {!!subtitle && <Caption large>{subtitle}</Caption>}
    </Left>
    {actions && showActions &&
      <Right disabled={disabled}>
        {actions}
      </Right>}
  </ActionHeaderStyle>
);

ActionsHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  subtitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  titleIcon: PropTypes.node,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  showActions: PropTypes.bool,
  showBackNav: PropTypes.bool,
  navTo: PropTypes.string,
  disabled: PropTypes.bool,
};

ActionsHeader.defaultProps = {
  title: null,
  subtitle: null,
  actions: null,
  titleIcon: null,
  showActions: true,
  showBackNav: false,
  navTo: '/',
  disabled: false,
};

export default withTheme(ActionsHeader);
