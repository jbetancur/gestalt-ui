import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Title, Caption } from 'components/Typography';

const ActionHeaderStyle = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 48px;
  width: 100%;
  padding-left: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
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

const ActionsHeader = ({ title, subtitle, titleIcon, actions, showActions, disabled }) => (
  <ActionHeaderStyle>
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
      {!!subtitle && <Caption>{subtitle}</Caption>}
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
  disabled: PropTypes.bool,
};

ActionsHeader.defaultProps = {
  title: null,
  subtitle: null,
  actions: null,
  titleIcon: null,
  showActions: true,
  disabled: false,
};

export default withTheme(ActionsHeader);
