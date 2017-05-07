import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';

class IntegrationItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    integrations: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    fetchIntegrations: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params, fetchIntegrations } = this.props;

    fetchIntegrations(params.fqon, params.environmentId);
  }

  render() {
    const integrations = this.props.integrations.map(integration => (
      <TableRow key={integration.id}>
        <TableColumn>{integration.name}</TableColumn>
        <TableColumn>{integration.description}</TableColumn>
        <TableColumn><FontIcon>more_vert</FontIcon></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Integrations"
          />
          {this.props.pending ? <LinearProgress scale={3} centered={true} /> : <DataTable baseId="integrations">
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn />
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default IntegrationItem;

