import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from 'components/Buttons';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import { OrganizationIcon, WorkspaceIcon, EnvironmentIcon, DeleteIcon } from 'components/Icons';
import { ORGANIZATION, WORKSPACE, ENVIRONMENT } from '../../../constants';

const CustomListItemText = styled(ListItemText)`
  white-space: normal;
`;

const iconMap = {
  [ORGANIZATION]: <OrganizationIcon />,
  [WORKSPACE]: <WorkspaceIcon />,
  [ENVIRONMENT]: <EnvironmentIcon />,
};

class FavoriteItem extends PureComponent {
  static propTypes = {
    favorite: PropTypes.object.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleNavigation = () => {
    const { favorite, onNavigate, onClose } = this.props;

    onNavigate(favorite);
    onClose();
  }

  handleDelete = () => {
    const { favorite, onDelete } = this.props;

    onDelete(favorite);
  }

  render() {
    const { favorite } = this.props;

    return (
      <ListItem key={favorite.resource_id} button divider onClick={this.handleNavigation}>
        <Avatar>
          {iconMap[favorite.resource_type_id]}
        </Avatar>
        <CustomListItemText primary={favorite.nickname || favorite.resource_name} secondary={favorite.resource_description} />
        <ListItemSecondaryAction>
          <IconButton icon={<DeleteIcon />} onClick={this.handleDelete} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}


export default FavoriteItem;
