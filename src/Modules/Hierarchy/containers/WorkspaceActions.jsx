import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import { Link } from 'react-router-dom';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import { Button } from 'components/Buttons';
import Div from 'components/Div';
import withHierarchy from '../withHierarchy';

const listItemStyle = { textAlign: 'left' };

class WorkspaceActions extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    hierarchyActions: PropTypes.object.isRequired,
  };

  render() {
    const { workspace, pending, match, hierarchyActions } = this.props;
    const name = workspace.description || workspace.name;

    return (
      <Div display="inline" disabled={pending}>
        <MenuButton
          id="workspace-settings-menu"
          position="below"
          iconChildren="add"
          flat
          sameWidth={false}
          label="Create"
        >
          <ListItem
            id="workspace-settings-menu--environment-create"
            primaryText="Environment"
            component={Link}
            leftIcon={<FontIcon>folder</FontIcon>}
            to={{ pathname: `${match.url}/createEnvironment`, state: { modal: true } }}
            style={listItemStyle}
          />
          <ListItem
            id="workspace-settings-menu--provider-create"
            primaryText="Provider"
            component={Link}
            leftIcon={<FontIcon>settings_applications</FontIcon>}
            to={`${match.url}/createProvider`}
            style={listItemStyle}
          />
        </MenuButton>
        <Button
          flat
          iconChildren="security"
          onClick={() => hierarchyActions.showEntitlementsModal(name, match.params, 'Workspace')}
        >
        Entitlements
        </Button>
      </Div>
    );
  }
}

export default compose(
  withMetaResource,
  withHierarchy,
)(WorkspaceActions);
