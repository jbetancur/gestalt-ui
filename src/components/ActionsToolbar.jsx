import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Title, Subtitle } from 'components/Typography';

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

const TitleStyle = styled.div`
  flex: 1 1 auto;
`;

const IconStyle = styled.div`
  padding-right: 8px;
  display: inline-block;
`;

const ActionStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1 1 auto;
`;

const ActionsHeader = ({ title, subtitle, titleIcon, actions, showActions }) => (
  <ActionHeaderStyle>
    <TitleStyle>
      <Title>
        {!!titleIcon &&
        <IconStyle>
          {titleIcon}
        </IconStyle>}
        <span>{title}</span>
      </Title>
      {!!subtitle &&
        <Subtitle>{subtitle}</Subtitle>}
    </TitleStyle>
    {actions && showActions &&
      <ActionStyle>
        {actions}
      </ActionStyle>}
  </ActionHeaderStyle>
);

ActionsHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  subtitle: PropTypes.string,
  titleIcon: PropTypes.node,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  showActions: PropTypes.bool,
};

ActionsHeader.defaultProps = {
  title: null,
  subtitle: null,
  actions: null,
  titleIcon: null,
  showActions: true,
};

export default withTheme(ActionsHeader);
