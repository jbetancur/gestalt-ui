import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CreateIcon from '@material-ui/icons/Add';
import withContext from '../hocs/withContext';
import createItems from '../config/createItems';
import iconMap from '../config/iconMap';

class CreateMenu extends PureComponent {
  static propTypes = {
    hierarchyContext: PropTypes.object.isRequired,
    enableExperimental: PropTypes.bool,
  };

  static defaultProps = {
    enableExperimental: false,
  };

  generateMenuItems() {
    const {
      hierarchyContext,
      enableExperimental,
    } = this.props;

    const {
      context: {
        contextMeta
      },
      context,
    } = hierarchyContext;

    const items = contextMeta.context
      ? createItems(context, enableExperimental)[contextMeta.context]
      : [];

    return items.map(item => (
      <ListItem key={item.key} dense button component={Link} to={item.to}>
        {iconMap(item.icon)}
        <ListItemText primary={item.title} />
      </ListItem>
    ));
  }

  render() {
    const { hierarchyContext } = this.props;
    const { contextPending } = hierarchyContext;

    return (
      <MenuButton
        id="orgs-settings-menu"
        flat
        disabled={contextPending}
        label="Create New"
        icon={<CreateIcon fontSize="small" />}
      >
        {this.generateMenuItems()}
      </MenuButton>
    );
  }
}

export default withContext()(CreateMenu);
