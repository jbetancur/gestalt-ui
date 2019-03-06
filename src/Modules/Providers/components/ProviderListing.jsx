import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { DeleteIconButton } from 'components/Buttons';
import { ProviderIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';
import ConfirmModal from 'Modules/ModalRoot/Modals/ConfirmModal';
import NameModal from 'Modules/ModalRoot/Modals/NameModal';
import { generateContextEntityState } from 'util/helpers/context';
import { getLastFromSplit } from 'util/helpers/strings';
import { formatName } from 'util/forms';
import actions from '../actions';
import withContext from '../../Hierarchy/hocs/withContext';
import withProviders from '../hocs/withProviders';
import providerModel from '../models/provider';
import { uiProviderTypes } from '../lists/providerTypes';

class ProviderListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    providersPending: PropTypes.bool.isRequired,
    providersActions: PropTypes.object.isRequired,
    hierarchyContext: PropTypes.object.isRequired,
  };

  static contextType = ModalConsumer;

  componentDidMount() {
    const { match, providersActions } = this.props;
    const entity = generateContextEntityState(match.params);

    providersActions.fetchProviders({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  handleClone = (row) => {
    const { match, providersActions, hierarchyContext } = this.props;
    const { context: { contextMeta, organization, workspace, environment, organizations, workspaces, environments } } = hierarchyContext;
    const { showModal } = this.context;
    let targetDropdownLabel;
    let targetDropdownValues;

    // TODO: much of this is repeated code, and weid, but, eventually some of the path resolution logic will move into the context saga
    if (contextMeta.context === 'environment') {
      targetDropdownLabel = 'Select Environment';
      targetDropdownValues = environments;
    } else if (contextMeta.context === 'workspace') {
      targetDropdownLabel = 'Select Workspace';
      // as workspace context does not include its own workspace
      targetDropdownValues = [...[workspace], ...workspaces];
    } else {
      targetDropdownLabel = 'Select Organization';
      // as org context does not include its own org
      targetDropdownValues = [...[organization], ...organizations];
    }

    const modalAction = ({ name, selectedTargetValue }) => {
      let payload;
      // use the correct model to format the provider payload
      const index = uiProviderTypes.findIndex(p => p.name === row.resource_type);
      if (index > -1) {
        payload = uiProviderTypes[index].model.create({ ...row, name });
      } else {
        payload = providerModel.create({ ...row, name });
      }

      if (contextMeta.context === 'environment') {
        const updateState = environment.id === selectedTargetValue;

        providersActions.createProviders({ fqon: match.params.fqon, entityId: selectedTargetValue, entityKey: 'environments', payload, updateState });
      } else if (contextMeta.context === 'workspace') {
        const updateState = workspace.id === selectedTargetValue;

        providersActions.createProviders({ fqon: match.params.fqon, entityId: selectedTargetValue, entityKey: 'workspaces', payload, updateState });
      } else {
        const updateState = organization.id === selectedTargetValue;

        providersActions.createProviders({ fqon: match.params.fqon, payload, updateState });
      }
    };

    showModal(NameModal, {
      title: `Clone "${row.name}" Provider`,
      nameFormatter: formatName,
      proceedLabel: 'Clone',
      onProceed: modalAction,
      targetDropdownLabel,
      showTargetDropdown: true,
      targetDropdownValues,
      defaultTargetValue: row.properties.parent.id,
    });
  }

  deleteOne = (row) => {
    const { match, providersActions } = this.props;
    const { showModal } = this.context;

    showModal(ConfirmModal, {
      title: `Are you sure you want to delete ${row.name}?`,
      onProceed: ({ force }) => providersActions.deleteProvider({ fqon: match.params.fqon, resource: row, params: { force } }),
    });
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
  }

  defineContextActions() {
    return [
      <DeleteIconButton key="delete-items" onClick={this.deleteMultiple} />,
    ];
  }

  defineColumns() {
    return [
      {
        width: '56px',
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            onClone={this.handleClone}
            editURL={`${this.props.match.url}/${row.id}`}
            entityKey="providers"
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => (
          <Name
            name={row.name}
            description={row.description}
            maxWidth="450px"
          />
        )
      },
      {
        name: 'Type',
        selector: 'resource_type',
        sortable: true,
        format: row => row.resource_type && getLastFromSplit(row.resource_type),
      },
      {
        name: 'Parent',
        selector: 'properties.parent.name',
        sortable: true,
      },
      {
        name: 'Owner',
        selector: 'owner.name',
        sortable: true,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />,
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.modified.timestamp} />,
      },
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col flex={12}>
          <Card>
            <DataTable
              title="Providers"
              data={this.props.providers}
              highlightOnHover
              pointerOnHover
              sortIcon={<ArrowDownIcon />}
              defaultSortField="name"
              progressPending={this.props.providersPending}
              progressComponent={<LinearProgress id="provider-listing" />}
              columns={this.defineColumns()}
              contextActions={this.defineContextActions()}
              noDataComponent={<NoData message="There are no providers to display" icon={<ProviderIcon size={150} />} />}
              onRowClicked={this.handleRowClicked}
              actions={<SelectFilter disabled={this.props.providersPending} />}
              pagination
              paginationPerPage={25}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  providers: listSelectors.filterItems()(state, 'providers.providers.providers'),
});

export default compose(
  withContext(),
  withProviders(),
  connect(mapStateToProps, actions),
)(ProviderListing);
