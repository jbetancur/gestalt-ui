import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MenuButton, ListItem, FontIcon } from 'react-md';
import { FormattedRelative } from 'react-intl';
import { Card } from 'components/Cards';
// import { FavoriteCheckbox } from 'Modules/UserProfile';
import CardTitle from './GFCardTitle';

const CardStyle = styled(Card)`
  display: flex;
  min-height: 115px;
`;

const Type = styled.div`
  position: absolute;

  /* fixes chrome issue where on zoom in where there is a gap in the logo */
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 35px solid ${props => props.cardColor};
  border-right: 35px solid transparent;

  i,
  svg {
    position: absolute;
    top: -31px;
    left: 3px;
    color: white;
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  cursor: pointer;
  width: calc(100% - 48px);
`;

const Actions = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0 4px 0;
  width: 48px;
`;

const Divider = styled.div`
  position: relative;
  background-color: ${props => props.theme.colors.divider};
  width: 1px;
  flex-shrink: 0;
`;

const EnvironmentType = styled.div`
  max-width: 180px;
  padding-left: 24px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;

  &,
  i {
    font-size: 12px !important;
    color: ${props => props.theme.colors['$md-grey-700']};
  }

  i {
    padding-right: 3px;
  }
`;

const Created = styled.div`
  position: absolute;
  left: 8px;
  bottom: 6px;
  line-height: 12px;

  &,
  i {
    font-size: 12px !important;
    color: ${props => props.theme.colors['$md-grey-500']};
  }

  i {
    padding-right: 3px;
  }
`;

const GFCard = memo(({ id, title, subtitle, environmentType, created, cardColor, cardIcon, menuActions, onClick, noShadow }) => (
  <CardStyle raise noShadow={noShadow}>
    <Content onClick={onClick}>
      <Type cardIcon={cardIcon} cardColor={cardColor}>{cardIcon}</Type>
      <CardTitle
        title={title}
        subtitle={subtitle}
      />
      {environmentType &&
        <EnvironmentType>
          {environmentType}
        </EnvironmentType>}

      <Created>
        <FontIcon>date_range</FontIcon>
        <FormattedRelative value={created} />
      </Created>
    </Content>
    <Divider />
    <Actions>
      <MenuButton
        id={`${id}--actions`}
        icon
        primary
        menuItems={menuActions.map(action => (
          <ListItem
            key={action.id}
            primaryText={action.title}
            onClick={action.onClick}
            leftIcon={action.icon}
          />)
        )}
        centered
        anchor={{
          x: MenuButton.HorizontalAnchors.CENTER,
          y: MenuButton.VerticalAnchors.CENTER,
        }}
      >
        more_vert
      </MenuButton>
      {/* <FavoriteCheckbox id={id} />  */}
    </Actions>
  </CardStyle>
));

GFCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  environmentType: PropTypes.string,
  created: PropTypes.string.isRequired,
  cardIcon: PropTypes.oneOfType([
    PropTypes.node
  ]),
  cardColor: PropTypes.string,
  menuActions: PropTypes.array,
  onClick: PropTypes.func,
  noShadow: PropTypes.bool,
};

GFCard.defaultProps = {
  subtitle: null,
  cardIcon: '',
  cardColor: '#b0bec5',
  menuActions: [],
  onClick: () => { },
  noShadow: false,
  environmentType: null,
};

export default GFCard;
