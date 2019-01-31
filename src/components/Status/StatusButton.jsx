import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { MenuButton } from 'react-md';
import statusMap from './statusMap';

const MenuButtonStyle = styled(MenuButton)`
  ${props => props.color &&
    css`
      color: ${props.theme.colors[props.color]};
      border: 2px solid ${props.theme.colors[props.color]} !important;

      .md-icon-text {
        font-weight: 600 !important;
      }

      &:hover {
        color: white;
        background-color: ${props.theme.colors[props.color]} !important;
        opacity: 0.9;
      }
    `};
`;

const StatusButton = ({ status, inMenu, menuItems }) => {
  const statMap = statusMap(status);
  const backgroundColor = inMenu ? null : statMap.color;
  const icon = inMenu ? 'more_vert' : 'expand_more';
  const anchorX = inMenu ? 'INNER_LEFT' : 'INNER_RIGHT';
  const positionX = inMenu ? 'TOP_LEFT' : 'TOP_RIGHT';

  return (
    <MenuButtonStyle
      id="container-actions-menu"
      icon={inMenu}
      flat={!inMenu}
      disabled={!status}
      iconChildren={icon}
      iconBefore={inMenu}
      menuItems={menuItems}
      inkDisabled={inMenu}
      listHeightRestricted={false}
      simplifiedMenu={false}
      repositionOnScroll={false}
      position={MenuButton.Positions[positionX]}
      anchor={{
        x: MenuButton.HorizontalAnchors[anchorX],
        y: MenuButton.VerticalAnchors.OVERLAP,
      }}
      primary={inMenu}
      color={backgroundColor}
    >
      {!inMenu && status}
    </MenuButtonStyle>
  );
};

StatusButton.propTypes = {
  status: PropTypes.string,
  inMenu: PropTypes.bool,
  menuItems: PropTypes.array,
};

StatusButton.defaultProps = {
  status: 'PENDING',
  inMenu: false,
  menuItems: [],
};

export default StatusButton;
