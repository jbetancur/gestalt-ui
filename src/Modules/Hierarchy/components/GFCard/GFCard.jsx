import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, withTheme } from 'styled-components';
// import { FormattedRelative } from 'react-intl';
import { MenuButton, ListItem } from 'react-md';

// black list non compliance typeColor, typeSymbol from DOM
const CardStyle = styled.div`
  position: relative;
  background: white;
  height: 10.5em;
  border-radius: 2px;
  cursor: pointer;
  ${props => !props.noShadow && 'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 0 1px -3px rgba(0, 0, 0, 0.2)'};

  ${props => props.raise && css`
    transition-duration: .3s;
    transition-property: box-shadow;

    &:hover {
      box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.14), 0 3px 6px 2px rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.2)
    }
  `};
`;

const ClickMask1 = styled.div`
  position: absolute;
  width: 85%;
  height: 100%;
  top: 0;
  left: 0;
  /* clip-path: polygon(0% 15%, 0 0, 15% 0%, 85% 0%, 85% 33%, 100% 33%, 100% 85%, 100% 100%, 85% 100%, 15% 100%, 0% 100%, 0% 85%); */
`;

const ClickMask2 = styled.div`
  position: absolute;
  width: 15%;
  height: 7em;
  bottom: 0;
  right: 0;
`;

const Type = styled.div`
  position: absolute;
  /* fixes chrome issue where on zoom in where there is a gap in the logo */
  top: 0;
  left: 0;
  font-size: 1em;
  width: 0;
  height: 0;
  border-top: 25px solid ${props => props.typeColor};
  border-right: 25px solid transparent;

  span {
    text-align: center;
    height: 12px;
    width: 12px;
    font-family: 'lovelo';
    font-size: 0.6em;
    position: absolute;
    top: -21px;
    left: 1.5px;
    color: white;
  }
`;

const Actions = styled.div`
  position: absolute;
  top: 5px;
  right: 8px;
`;

const GFCard = ({ id, typeColor, typeSymbol, menuActions, onClick, noShadow, children, ...rest }) => (
  <CardStyle raise noShadow={noShadow} {...rest}>
    <ClickMask1 onClick={onClick} />
    <ClickMask2 onClick={onClick} />
    <Type typeSymbol={typeSymbol} typeColor={typeColor}><span>{typeSymbol}</span></Type>
    <Actions>
      <MenuButton
        id={`${id}--actions`}
        icon
        primary
        menuItems={menuActions.map(action => <ListItem key={action.id} primaryText={action.title} onClick={action.onClick} leftIcon={action.icon} />)}
        centered
        anchor={{
          x: MenuButton.HorizontalAnchors.CENTER,
          y: MenuButton.VerticalAnchors.CENTER,
        }}
      >
        more_vert
      </MenuButton>
    </Actions>
    {/* <Bottom>
      <Right>
        <div>{owner}</div>
        created <FormattedRelative value={created} />
      </Right>
      <Left>
      </Left>
    </Bottom> */}
    {children}
  </CardStyle>
);

GFCard.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.array,
  typeSymbol: PropTypes.string,
  typeColor: PropTypes.string,
  menuActions: PropTypes.array,
  onClick: PropTypes.func,
  noShadow: PropTypes.bool,
};

GFCard.defaultProps = {
  children: [],
  typeSymbol: '',
  typeColor: '#b0bec5',
  menuActions: [],
  onClick: () => { },
  noShadow: false,
};

export default withTheme(GFCard);
