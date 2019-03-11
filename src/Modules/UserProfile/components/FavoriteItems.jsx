import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import orderBy from 'lodash/orderBy';
import memoize from 'memoize-one';
import { IconButton } from 'components/Buttons';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FavoriteItem from './FavoriteItem';
import { AppConsumer } from '../../../App/AppContext';
import withUserProfile from '../hocs/withUserProfile';
import { generateRoutePathByTypeId } from '../util';

const Subheader = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 6px;
  background-color: ${props => props.theme.colors.background.default};
  z-index: 1;
  border-bottom: 1px solid ${props => props.theme.colors.dividerVariant};

  button {
    margin-left: 8px;
    margin-right: 16px;
  }

  span {
    width: 100%;
    color: ${props => props.theme.colors.font};
    font-size: 16px;
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
    history: PropTypes.object.isRequired,
    favorites: PropTypes.array.isRequired,
    userProfileActions: PropTypes.object.isRequired,
  }

  sort = memoize(array => orderBy(array, ['nickname', 'resource_name']));

  handleDeleteFavorite = (favorite) => {
    const { userProfileActions } = this.props;

    userProfileActions.deleteFavorite({ id: favorite.resource_id });
  }

  handleNavigation = (favorite) => {
    const { history } = this.props;

    history.push(generateRoutePathByTypeId(favorite));
  }

  render() {
    const { favorites } = this.props;
    const favoriteItems = this.sort(favorites);

    return (
      <AppConsumer>
        {({ onCloseFavorites }) => (
          <ClickAwayListener onClickAway={onCloseFavorites}>
            <React.Fragment>
              <List subheader={(
                <Subheader>
                  <IconButton icon={<CloseIcon color="action" />} onClick={onCloseFavorites} />
                  <span>Favorite Resources</span>
                </Subheader>
              )}
              >
                {favoriteItems.map(favorite => (
                  <FavoriteItem
                    key={favorite.resource_id}
                    favorite={favorite}
                    onNavigate={this.handleNavigation}
                    onDelete={this.handleDeleteFavorite}
                    onClose={onCloseFavorites}
                  />
                ))}
              </List>
              {!favoriteItems.length > 0 && <NoItems>No resources have been starred</NoItems>}
            </React.Fragment>
          </ClickAwayListener>
        )}
      </AppConsumer>
    );
  }
}

export default withUserProfile(withRouter(FavoriteItems));
