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
import { FontIcon } from 'react-md';
import { generateContextEntityState } from 'util/helpers/context';
import { getLastFromSplit } from 'util/helpers/strings';
import actions from '../actions';
import withProviders from '../hocs/withProviders';

class ProviderListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    providers: PropTypes.array.isRequired,
    providersPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    providersActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, providersActions } = this.props;
    const entity = generateContextEntityState(match.params);

    providersActions.fetchProviders({ fqon: match.params.fqon, entityId: entity.id, entityKey: entity.key });
  }

  deleteOne = (row) => {
    const { match, providersActions } = this.props;

    this.props.confirmDelete(({ force }) => {
      providersActions.deleteProvider({ fqon: match.params.fqon, resource: row, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
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
        <Col component={Card} flex={12}>
          <DataTable
            title="Providers"
            data={this.props.providers}
            highlightOnHover
            pointerOnHover
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
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
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  providers: listSelectors.filterItems()(state, 'providers.providers.providers'),
});

export default compose(
  withProviders(),
  connect(mapStateToProps, actions),
)(ProviderListing);
