import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, FontIcon } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { ClipboardButton } from 'components/Buttons';
import Div from 'components/Div';
import A from 'components/A';
import StatusBubble from 'components/StatusBubble';
import { Caption } from 'components/Typography';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableColumnTimestamp } from 'components/Tables';
import { getLastFromSplit, truncate } from 'util/helpers/strings';
import APIEndpointDeleteButton from './APIEndpointDeleteButton';

class APIEndpointInlineList extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    endpoints: PropTypes.array.isRequired,
    onAddEndpoint: PropTypes.func.isRequired,
    deleteAPIEndpoint: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    disabled: false
  }

  delete = (endpoint) => {
    const { match, deleteAPIEndpoint } = this.props;

    deleteAPIEndpoint(match.params.fqon, endpoint.id);
  }

  render() {
    const { endpoints, onAddEndpoint, disabled } = this.props;

    const items = endpoints.map(endpoint => (
      <TableRow key={endpoint.id}>
        <TableColumn style={{ width: '170px' }}>
          <StatusBubble status={getLastFromSplit(endpoint.resource_state)} />
        </TableColumn>
        <TableColumn>
          <ClipboardButton
            showLabel={false}
            text={endpoint.properties.public_url}
          />
          <A href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer">{endpoint.properties.public_url}</A>
        </TableColumn>
        <TableColumn>
          <Caption small>
            {endpoint.properties.methods &&
              endpoint.properties.methods.length > 0 &&
              endpoint.properties.methods.map(m => <div key={`${endpoint.id}--${m}`}>{m}</div>)}
          </Caption>
        </TableColumn>
        <TableColumn numeric>
          {endpoint.properties.plugins && endpoint.properties.plugins.rateLimit && endpoint.properties.plugins.rateLimit.enabled && endpoint.properties.plugins.rateLimit.perMinute}
        </TableColumn>
        <TableColumn numeric>
          {endpoint.properties.plugins && endpoint.properties.plugins.gestaltSecurity && endpoint.properties.plugins.gestaltSecurity.enabled && <FontIcon>checked</FontIcon>}
        </TableColumn>
        <TableColumn>{endpoint.properties.implementation_type}</TableColumn>
        <TableColumn>{truncate(endpoint.owner.name, 25)}</TableColumn>
        <TableColumnTimestamp timestamp={endpoint.created.timestamp} />
        <TableColumn style={{ width: '64px' }}>
          <APIEndpointDeleteButton endpoint={endpoint} onDelete={this.delete} />
        </TableColumn>
      </TableRow>
    ));

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
        <DataTable baseId="apiEndpoints" plain>
          {this.props.endpoints.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn>State</TableColumn>
              <TableColumn>Public URL</TableColumn>
              <TableColumn>Methods</TableColumn>
              <TableColumn numeric>Rate Limit</TableColumn>
              <TableColumn style={{ padding: 0 }}>Auth</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Created</TableColumn>
              <TableColumn />
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

export default compose(
  withMetaResource,
  withRouter,
)(APIEndpointInlineList);
