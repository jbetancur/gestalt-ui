import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { orderBy } from 'lodash';
import memoize from 'memoize-one';
import { Button } from 'components/Buttons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { OrganizationIcon, WorkspaceIcon, EnvironmentIcon, DeleteIcon } from 'components/Icons';
import { AppConsumer } from '../../../App/AppContext';
import withUserProfile from '../hocs/withUserProfile';
import { ORGANIZATION, WORKSPACE, ENVIRONMENT } from '../../../constants';

const iconMap = {
  [ORGANIZATION]: <OrganizationIcon />,
  [WORKSPACE]: <WorkspaceIcon />,
  [ENVIRONMENT]: <EnvironmentIcon />,
};

const Subheader = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 6px;
  border-bottom: 1px solid ${props => props.theme.colors.dividerVariant};

  button {
    margin-left: 8px;
  }

  span {
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;
    color: ${props => props.theme.colors.font};
    font-size: 14px;
    font-weight: 500;
    user-select: none;
  }
`;

const NoItems = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  flex-direction: column;
  height: 100%;
  font-size: 15px;
  color: ${props => props.theme.colors.fontCaption};
`;

class FavoriteItems extends PureComponent {
  static propTypes = {
    favorites: PropTypes.array.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  }

  sort = memoize(array => orderBy(array, ['nickname', 'resource_name']));

  handleDeleteFavorite = (id) => {
    const { userProfileActions } = this.props;

    userProfileActions.deleteFavorite({ id });
  }

  render() {
    const { favorites } = this.props;
    const favoriteItems = this.sort(favorites);

    return (
      <AppConsumer>
        {({ onCloseFavorites }) => (
          <React.Fragment>
            <List subheader={(
              <Subheader>
                <Button icon onClick={onCloseFavorites}>close</Button>
                <span>Favorites</span>
              </Subheader>
            )}
            >
              {favoriteItems.map(favorite => (
                <ListItem key={favorite.resource_id} button divider>
                  <Avatar>
                    {iconMap[favorite.resource_type_id]}
                  </Avatar>
                  <ListItemText primary={favorite.nickname || favorite.resource_name} secondary={favorite.resource_description} />
                  <Button icon onClick={() => this.handleDeleteFavorite(favorite.resource_id)}><DeleteIcon /></Button>
                </ListItem>
              ))}
            </List>
            {!favoriteItems.length > 0 && <NoItems>No Favorites have been saved</NoItems>}
          </React.Fragment>
        )}
      </AppConsumer>
    );
  }
}

export default withUserProfile(FavoriteItems);
