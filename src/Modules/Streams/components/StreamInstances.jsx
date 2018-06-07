import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withProviderActions } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import { FontIcon } from 'react-md';
import { Card } from 'components/Cards';
import { Timestamp } from 'components/TableCells';
import { Button } from 'components/Buttons';
import DataTable from 'react-data-table-component';
import { ActionsMenu } from 'Modules/Actions';
import { Title } from 'components/Typography';
import actions from '../actions';

class StreamInstances extends Component {
  defineColumns() {
    const { fqon, streamSpec, providerActions, onActionComplete, showModal } = this.props;

    const columns = [
      {
        minWidth: '170px',
        ignoreRowClick: true,
        compact: true,
        cell: row => (
          <Button
            flat
            primary
            onClick={() => showModal({ fqon, streamId: streamSpec.id, persistenceId: row.persistenceId })}
            disabled={row.status === 'stopped'}
          >
            View Stream
          </Button>
        )
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
      },
      {
        name: 'Started',
        selector: 'startTime',
        sortable: true,
        cell: row => <Timestamp timestamp={row.startTime} />
      },
      {
        name: 'Retries',
        selector: 'retries',
        sortable: true,
      },
    ];


    if (providerActions.providerActions && providerActions.providerActions.length > 0) {
      columns.unshift({
        width: '56px',
        allowOverflow: true,
        ignoreRowClick: true,
        cell: row => (
          <ActionsMenu
            icon
            onActionComplete={onActionComplete}
            model={row}
            actionList={providerActions.providerActions}
            pending={providerActions.providerActionsLoading}
            isChildResource
            keyField="persistenceId"
            parentKeyField="definitionId"
            fqon={fqon}
          />
        )
      });
    }

    return columns;
  }

  render() {
    const { streamInstances } = this.props;

    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <DataTable
            noHeader
            data={streamInstances}
            sortIcon={<FontIcon>arrow_downward</FontIcon>}
            defaultSortField="status"
            columns={this.defineColumns()}
            noDataComponent={<Title light>No streams have been started</Title>}
          />
        </Col>
      </Row>
    );
  }
}

StreamInstances.propTypes = {
  fqon: PropTypes.string.isRequired,
  streamSpec: PropTypes.object.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.object.isRequired,
  onActionComplete: PropTypes.func,
  showModal: PropTypes.func.isRequired,
};

StreamInstances.defaultProps = {
  onActionComplete: () => {},
};

export default compose(
  withProviderActions({ filter: 'streamspec.instances' }),
  connect(null, actions)
)(StreamInstances);
