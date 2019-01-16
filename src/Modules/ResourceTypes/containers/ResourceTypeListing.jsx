import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions, NoData } from 'components/TableCells';
import { LinearProgress } from 'components/ProgressIndicators';
import { MetamodelIcon } from 'components/Icons';
import { Card } from 'components/Cards';
import { Checkbox, FontIcon } from 'react-md';
import { SelectFilter, listSelectors } from 'Modules/ListFilter';
import actions from '../actions';
import withResourceTypes from '../hocs/withResourceTypes';

class ResourceTypeListing extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    resourceTypesActions: PropTypes.object.isRequired,
    resourceTypesPending: PropTypes.bool.isRequired,
    confirmDelete: PropTypes.func.isRequired,
  };

  state = { selectedRows: [], clearSelected: false };

  componentDidMount() {
    const { match, resourceTypesActions } = this.props;

    resourceTypesActions.fetchResourceTypes({ fqon: match.params.fqon });
  }

  deleteOne = (row) => {
    const { match, resourceTypesActions } = this.props;

    const onSuccess = () => {
      resourceTypesActions.fetchResourceTypes({ fqon: match.params.fqon });
    };

    this.props.confirmDelete(({ force }) => {
      resourceTypesActions.deleteResourceType({ fqon: match.params.fqon, resource: row, onSuccess, params: { force } });
    }, `Are you sure you want to delete ${row.name}?`);
  }

  handleTableChange = ({ selectedRows }) => {
    this.setState({ selectedRows });
  };

  handleRowClicked = (row) => {
    const { history, match } = this.props;

    history.push(`${match.url}/${row.id}`);
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
            entityKey="resourcetypes"
            disableEntitlements
            {...this.props}
          />
        ),
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 3,
        cell: row => <Name maxWidth="500px" name={row.name} description={row.description} />
      },
      {
        name: 'Abstract',
        selector: 'properties.abstract',
        sortable: true,
        center: true,
        cell: row => <Checkbox inkDisabled defaultChecked={row.properties.abstract} disabled />
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
      {
        name: 'Modified',
        selector: 'modified.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.modified.timestamp} />
      },
    ];
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            title="Resource Types"
            data={this.props.resourceTypes}
            highlightOnHover
            pointerOnHover
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="name"
            progressPending={this.props.resourceTypesPending}
            progressComponent={<LinearProgress id="resourcetype-listing" />}
            columns={this.defineColumns()}
            onTableUpdate={this.handleTableChange}
            clearSelectedRows={this.state.clearSelected}
            noDataComponent={<NoData message="There are no resource types to display" icon={<MetamodelIcon size={150} />} />}
            onRowClicked={this.handleRowClicked}
            actions={<SelectFilter disabled={this.props.resourceTypesPending} />}
            pagination
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  resourceTypes: listSelectors.filterItems()(state, 'resourceTypes.resourceTypes.resourceTypes'),
});

export default compose(
  withResourceTypes,
  connect(mapStateToProps, actions),
)(ResourceTypeListing);
