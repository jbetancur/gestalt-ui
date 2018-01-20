import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, FontIcon } from 'react-md';
import { ClipboardButton } from 'components/Buttons';
import A from 'components/A';
import StatusBubble from 'components/StatusBubble';
import { Caption } from 'components/Typography';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import { getLastFromSplit, truncate } from 'util/helpers/strings';

class APIEndpointInlineList extends PureComponent {
  static propTypes = {
    endpoints: PropTypes.array.isRequired,
    onAddEndpoint: PropTypes.func.isRequired,
  };

  render() {
    const { endpoints, onAddEndpoint } = this.props;

    const items = endpoints.map(apiEndpoint => (
      <TableRow key={apiEndpoint.id}>
        <TableColumn style={{ width: '170px' }}>
          <StatusBubble status={getLastFromSplit(apiEndpoint.resource_state)} />
        </TableColumn>
        <TableColumn>
          <ClipboardButton
            showLabel={false}
            text={apiEndpoint.properties.public_url}
          />
          <A href={apiEndpoint.properties.public_url} target="_blank" rel="noopener noreferrer">{apiEndpoint.properties.public_url}</A>
        </TableColumn>
        <TableColumn>
          <Caption small>
            {apiEndpoint.properties.methods &&
              apiEndpoint.properties.methods.length > 0 &&
              apiEndpoint.properties.methods.map(m => <div key={`${apiEndpoint.id}--${m}`}>{m}</div>)}
          </Caption>
        </TableColumn>
        <TableColumn numeric>
          {apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.rateLimit && apiEndpoint.properties.plugins.rateLimit.enabled && apiEndpoint.properties.plugins.rateLimit.perMinute}
        </TableColumn>
        <TableColumn numeric>
          {apiEndpoint.properties.plugins && apiEndpoint.properties.plugins.gestaltSecurity && apiEndpoint.properties.plugins.gestaltSecurity.enabled && <FontIcon>checked</FontIcon>}
        </TableColumn>
        <TableColumn>{apiEndpoint.properties.implementation_type}</TableColumn>
        <TableColumn>{truncate(apiEndpoint.owner.name, 25)}</TableColumn>
        <TableColumnTimestamp timestamp={apiEndpoint.created.timestamp} />
      </TableRow>
    ));

    return (
      <div>
        <TableCardHeader style={{ height: '40px' }}>
          <Button
            key="add-endpoint"
            iconChildren="link"
            primary
            flat
            onClick={onAddEndpoint}
          >
            Add Endpoint
          </Button>
        </TableCardHeader>
        <DataTable baseId="apiEndpoints" plain>
          {this.props.endpoints.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>State</TableColumn>
              <TableColumn>Public URL</TableColumn>
              <TableColumn>Methods</TableColumn>
              <TableColumn numeric>Rate Limit</TableColumn>
              <TableColumn style={{ padding: 0 }}>Authentication</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Created</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {items}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}

export default APIEndpointInlineList;
