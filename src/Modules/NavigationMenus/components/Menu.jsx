import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import { MenuButton, ListItem, TextField, Divider } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';
import { H3 } from 'components/Typography';
import { getRoutePattern } from 'util/helpers/transformations';

const EnhancedMenuButton = styled(MenuButton)`
  width: 17em;
  z-index: 99;
  margin-top: 0 !important;
  height: 100%;
  border-radius: 0;
  /* border-left: 1px solid ${props => props.theme.colors['$md-grey-800']}; */
  border-right: 1px solid ${props => props.theme.colors['$md-grey-800']};
  text-transform: none;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;

  &.md-menu-container--menu-below {
    height: 100%;
  }
`;

const ListWrapper = styled.div`
  min-width: 19.4em;
  padding: 1em;
  color: black;
`;

const DividerStyled = styled(Divider)`
  margin: 0 !important;
`;

const Menu = ({ id, title, name, pending, menuItems, onFetchItems, onFilterChange, routePattern }) => (
  <EnhancedMenuButton
    id="orgs-nav"
    position={MenuButton.Positions.BELOW}
    iconChildren="arrow_drop_down"
    flat
    iconBefore={false}
    onClick={onFetchItems}
    listHeightRestricted={false}
    menuItems={[
      <div key={id}>
        <ListWrapper key={`${id}--search`}>
          {!pending &&
            <div>
              <H3>{title}</H3>
              <TextField
                id={`search-orgs-${id}`}
                label="Search"
                fullWidth={true}
                onChange={onFilterChange}
              />
            </div>}
        </ListWrapper>
        <DotActivity
          id={`${id}--loader`}
          visible={pending}
          size={1.2}
          primary
          centered
        />

        {!pending && menuItems.map(item => (
          <div key={item.id}>
            <DividerStyled />
            <ListItem
              component={Link}
              primaryText={item.description || item.name}
              secondaryText={item.name}
              to={getRoutePattern(item, routePattern)}
            />
          </div>
        ))}
      </div>
    ]}
  >
    {name ||
      <DotActivity
        id={`${id}--name-loader`}
        key={`${id}--name-loader`}
        size={1}
        centered
      />}
  </EnhancedMenuButton>
);

Menu.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string,
  pending: PropTypes.bool.isRequired,
  menuItems: PropTypes.array,
  onFetchItems: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  routePattern: PropTypes.string.isRequired,
};

Menu.defaultProps = {
  name: null,
  menuItems: [],
};

export default withTheme(Menu);
