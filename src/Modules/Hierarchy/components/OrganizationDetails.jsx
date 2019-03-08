import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Divider from 'components/Divider';
import { DeleteIcon, EntitlementIcon, OrganizationIcon } from 'components/Icons';
import DetailsPane from 'components/DetailsPane';
import ActionsToolbar from 'components/ActionsToolbar';
import { EntitlementModal } from 'Modules/Entitlements';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import withSelf from '../../../App/hocs/withSelf';

class OrganizationDetails extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
    hierarchyContextActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
  };

  // TODO: will fix when react-router fixes hoisting error
  // static contextType = ModalConsumer;

  showEntitlements = () => {
    const { hierarchyContext } = this.props;
    const { context: { organization } } = hierarchyContext;
    const { showModal } = this.context;
    const name = organization.description || organization.name;

    showModal(EntitlementModal, {
      title: `Entitlements for "${name}" Organization`,
      fqon: organization.properties.fqon,
      entityId: null,
      entityKey: null,
    });
  }

  delete = (e) => {
    e.stopPropagation();
    const { hierarchyContext, history, hierarchyContextActions } = this.props;
    const { context: { organization } } = hierarchyContext;
    const { showModal } = this.context;
    const name = organization.description || organization.name;
    const onSuccess = () => history.replace(`/${organization.org.properties.fqon}/hierarchy`);

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete the "${name}" Organization`,
      values: { name, type: 'Environment' },
      requireConfirm: true,
      important: true,
      onProceed: ({ force }) => hierarchyContextActions.deleteOrg({ fqon: organization.properties.fqon, resource: organization, onSuccess, params: { force } }),
    });
  }

  renderActions() {
    const { match, hierarchyContext, self } = this.props;
    const { context: { organization } } = hierarchyContext;
    const deleteDisabled = match.params.fqon === self.properties.gestalt_home || match.params.fqon === 'root';

    return (
      <MenuButton
        id="environment--details--actions"
        flat
        flatColor="info"
        label="Actions"
        iconAfter
        icon={<ArrowDropDownIcon fontSize="small" />}
      >
        <ListItem dense button onClick={this.showEntitlements}>
          <EntitlementIcon size={20} />
          <ListItemText primary="Entitlements" />
        </ListItem>
        <ListItem dense button component={Link} to={{ pathname: `/${organization.properties.fqon}/editOrganization`, state: { modal: true } }}>
          <EditIcon color="action" fontSize="small" />
          <ListItemText primary="Edit" />
        </ListItem>
        <Divider />
        <ListItem dense button onClick={this.delete} disabled={deleteDisabled}>
          <DeleteIcon size={20} />
          <ListItemText primary="Delete" />
        </ListItem>
      </MenuButton>
    );
  }

  render() {
    const { hierarchyContext } = this.props;
    const { context: { organization } } = hierarchyContext;

    return (
      <React.Fragment>
        <ActionsToolbar
          title={`${organization.description || organization.name} Details`}
          titleIcon={<OrganizationIcon />}
          subtitle={`fqon: ${organization.properties.fqon}`}
          actions={this.renderActions()}
        />
        <DetailsPane model={organization} singleRow />
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  withSelf,
)(OrganizationDetails);

// TODO: Place here to fix hoisting issue
OrganizationDetails.contextType = ModalConsumer;
