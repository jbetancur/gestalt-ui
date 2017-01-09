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

class PolicyItem extends Component {
  static propTypes = {
    policies: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: true,
      deselectOnClickaway: true,
      showCheckboxes: true
    };
  }

  render() {
    const policies = this.props.policies.map(policy => (
      <TableRow key={policy.id}>
        <TableColumn>{policy.name}</TableColumn>
        <TableColumn>{policy.description}</TableColumn>
        <TableColumn><FontIcon>more_vert</FontIcon></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="policies"
          />
          {this.props.pending ? <LinearProgress scale={3} centered={true} /> : <DataTable baseId="policies">
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn />
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default PolicyItem;

