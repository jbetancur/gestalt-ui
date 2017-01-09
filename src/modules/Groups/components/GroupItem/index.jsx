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

class GroupItem extends Component {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const groups = this.props.groups.map(group => (
      <TableRow key={group.id}>
        <TableColumn>{group.name}</TableColumn>
        <TableColumn>{group.description}</TableColumn>
        <TableColumn>{group.created.timestamp}</TableColumn>
        <TableColumn><FontIcon>more_vert</FontIcon></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Groups"
          />
          {this.props.pending ? <LinearProgress scale={3} centered={true} /> : <DataTable baseId="Groups">
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Created</TableColumn>
                <TableColumn />
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default GroupItem;

