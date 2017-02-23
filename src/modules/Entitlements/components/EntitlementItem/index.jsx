import React, { Component, PropTypes } from 'react';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Breadcrumbs from 'modules/Breadcrumbs';

class EntitlementItem extends Component {
  static propTypes = {
    fetchEntitlements: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    entitlements: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params, fetchEntitlements } = this.props;
    const entityId = params.workspaceId || params.environmentId || null;
    const entityKey = params.workspaceId ? 'workspaces' : 'environments';

    fetchEntitlements(params.fqon, entityId, entityKey);
  }

  render() {
    const entitlements = this.props.entitlements.map(entitlement => (
      <TableRow key={entitlement.id}>
        <TableColumn>{entitlement.properties.action}</TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-6 flex-xs-12 flex-sm-12" tableCard>
          <TableCardHeader
            title={
              <div>
                <div className="gf-headline">Entitlements</div>
                {this.props.params.workspaceId ? null : <div className="md-caption"><Breadcrumbs /></div>}
              </div>
            }
          />
          {this.props.pending ? <LinearProgress id="entitlements-progress" scale={3} centered={true} /> :
          <DataTable baseId="entitlements" plain>
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entitlements}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default EntitlementItem;

