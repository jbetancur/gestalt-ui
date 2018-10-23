import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withApp from 'App/hocs/withApp';
import { Link } from 'react-router-dom';
import { ListItem, MenuButton } from 'react-md';
import withContext from '../hocs/withContext';
import createItems from '../config/createItems';
import iconMap from '../config/iconMap';

const listItemStyle = { textAlign: 'left' };

class CreateMenu extends PureComponent {
  static propTypes = {
    context: PropTypes.object.isRequired,
    contextPending: PropTypes.bool.isRequired,
    appState: PropTypes.object.isRequired,
  };

  generateMenuItems() {
    const {
      context: {
        contextMeta
      },
      context,
      appState: {
        enableExperimental
      },
    } = this.props;

    const items = contextMeta.context
      ? createItems(context, enableExperimental)[contextMeta.context]
      : [];

    return items.map(item => (
      <ListItem
        id={item.key}
        key={item.key}
        primaryText={item.title}
        component={Link}
        leftIcon={iconMap(item.icon)}
        to={item.to}
        style={listItemStyle}
      />
    ));
  }

  render() {
    const { contextPending } = this.props;

    return (
      <MenuButton
        id="orgs-settings-menu"
        anchor={{
          x: MenuButton.HorizontalAnchors.INNER_RIGHT,
          y: MenuButton.VerticalAnchors.BOTTOM,
        }}
        simplifiedMenu={false}
        iconChildren="add"
        flat
        sameWidth={false}
        menuItems={this.generateMenuItems()}
        listHeightRestricted={false}
        disabled={contextPending}
      >
        Create New
      </MenuButton>
    );
  }
}

export default compose(
  withContext(),
  withApp,
)(CreateMenu);
