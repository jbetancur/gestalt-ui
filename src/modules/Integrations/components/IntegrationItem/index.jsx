import React, { Component, PropTypes } from 'react';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';

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

