import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, FontIcon } from 'react-md';
import { withAPIEndpoints } from 'Modules/MetaResource';
import { ClipboardButton } from 'components/Buttons';
import { Title } from 'components/Typography';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-flexybox';
import { Timestamp, GenericMenuActions } from 'components/TableCells';
import { StatusBubble } from 'components/Status';
import Div from 'components/Div';
import { A } from 'components/Links';
import { getLastFromSplit } from 'util/helpers/strings';

class APIEndpointInlineList extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    apiEndpoints: PropTypes.array.isRequired,
    onAddEndpoint: PropTypes.func.isRequired,
    apiEndpointsActions: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  deleteOne = (endpoint) => {
    const { match, apiEndpointsActions } = this.props;

    apiEndpointsActions.deleteAPIEndpoint({ fqon: match.params.fqon, resource: endpoint, params: { force: true } });
  }

  defineColumns() {
    return [
      {
        width: '56px',
        allowOverflow: true,
        ignoreRowClick: true,
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
        sortable: true,
        allowOverflow: true,
        ignoreRowClick: true,
        center: true,
        cell: row => <StatusBubble status={getLastFromSplit(row.resource_state)} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        minWidth: '100px',
        compact: true,
      },
      {
        name: 'Public URL',
        selector: 'properties.public_url',
        sortable: true,
        ignoreRowClick: true,
        grow: 3,
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
        right: true,
        format: row => (row.properties.plugins && row.properties.plugins.rateLimit && row.properties.plugins.rateLimit.enabled && row.properties.plugins.rateLimit.perMinute) || '∞',
      },
      {
        name: 'Auth',
        selector: 'properties.plugins.gestaltSecurity.enabled',
        sortable: true,
        center: true,
        cell: row => row.properties.plugins && row.properties.plugins.gestaltSecurity && row.properties.plugins.gestaltSecurity.enabled && <FontIcon>check</FontIcon>
      },
      {
        name: 'Created',
        selector: 'created.timestamp',
        sortable: true,
        wrap: true,
        cell: row => <Timestamp timestamp={row.created.timestamp} />
      },
    ];
  }

  render() {
    const { onAddEndpoint, disabled, apiEndpoints } = this.props;

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
              data={apiEndpoints}
              highlightOnHover
              sortIcon={<FontIcon>arrow_downward</FontIcon>}
              defaultSortField="name"
              columns={this.defineColumns()}
              noDataComponent={<Title light>There are no endpoints to display</Title>}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(
  withAPIEndpoints({ unload: false }),
  withRouter,
)(APIEndpointInlineList);
