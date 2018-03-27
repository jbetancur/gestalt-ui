import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, FontIcon, Checkbox } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { ClipboardButton } from 'components/Buttons';
import { Title } from 'components/Typography';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Timestamp, GenericMenuActions } from 'components/TableCells';
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
        ignoreRowClick: true,
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Public URL',
        selector: 'properties.public_url',
        sortable: true,
        ignoreRowClick: true,
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
            primary
          >
            {row.properties.public_url}
          </A>
        ]
      },
      {
        name: 'Limit (m)',
        selector: 'properties.plugins.rateLimit.perMinute',
        sortable: true,
        number: true,
        width: '42px',
        format: row => (row.properties.plugins && row.properties.plugins.rateLimit && row.properties.plugins.rateLimit.enabled && row.properties.plugins.rateLimit.perMinute) || '∞',
      },
      {
        name: 'Auth',
        selector: 'properties.plugins.gestaltSecurity.enabled',
        sortable: true,
        center: true,
        width: '42px',
        cell: row => <Checkbox disabled defaultChecked={row.properties.plugins && row.properties.plugins.gestaltSecurity && row.properties.plugins.gestaltSecurity.enabled} />,
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        width: '158px',
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
              noDataComponent={<Title>There are no endpoints to display</Title>}
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
