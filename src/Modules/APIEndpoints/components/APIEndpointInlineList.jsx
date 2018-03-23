import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { ClipboardButton } from 'components/Buttons';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Name, Timestamp, GenericMenuActions } from 'components/TableCells';
import StatusBubble from 'components/StatusBubble';
import Div from 'components/Div';
import A from 'components/A';
import { getLastFromSplit } from 'util/helpers/strings';

class APIEndpointInlineList extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    endpoints: PropTypes.array.isRequired,
    onAddEndpoint: PropTypes.func.isRequired,
    deleteAPIEndpoint: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  deleteOne = (endpoint) => {
    const { match, deleteAPIEndpoint } = this.props;

    deleteAPIEndpoint(match.params.fqon, endpoint.id);
  }

  render() {
    const { endpoints, onAddEndpoint, disabled } = this.props;

    const columns = [
      {
        name: 'Actions',
        width: '42px',
        cell: row => (
          <GenericMenuActions
            row={row}
            fqon={this.props.match.params.fqon}
            onDelete={this.deleteOne}
            // editURL={getBaseURL(this.props.match.params, row)}
            entityKey="apiendpoints"
            {...this.props}
          />
        ),
      },
      {
        name: 'State',
        selector: 'resource_state',
        compact: true,
        sortable: true,
        width: '42px',
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Path',
        selector: 'name',
        sortable: true,
        cell: row => <Name name={row.name} description={row.description} />
      },
      {
        name: 'Public URL',
        selector: 'properties.public_url',
        sortable: true,
        cell: row => [
          <ClipboardButton
            key={`public-url-copy-${row.id}`}
            showLabel={false}
            text={row.properties.public_url}
          />,
          <A
            key={`public-url-link0${row.id}`}
            href={row.properties.public_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.properties.public_url}
          </A>
        ]
      },
      {
        name: 'Type',
        selector: 'properties.implementation_type',
        sortable: true,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];

    return (
      <div>
        <Div padding="8px" paddingLeft="16px">
          <Button
            key="add-endpoint"
            iconChildren="link"
            primary
            flat
            onClick={onAddEndpoint}
            disabled={disabled}
          >
            Add Endpoint
          </Button>
        </Div>
        <Row>
          <Col flex={12}>
            <DataTable
              noHeader
              data={endpoints}
              highlightOnHover
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              columns={columns}
              noDataComponent="There are no api endpoints to display"
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(
  withMetaResource,
  withRouter,
)(APIEndpointInlineList);

