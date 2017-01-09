import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'react-md/lib/Cards/Card';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons/Button';
import FontIcon from 'react-md/lib/FontIcons';

class LambdaItem extends Component {
  static propTypes = {
    lambdas: PropTypes.array.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.isRequired
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

  renderCreateButton() {
    const { fqon, environmentId, params } = this.props;

    return (
      <Button
        id="create-lambda"
        label="Create Lambda"
        flat
        component={Link}
        to={`${fqon}/workspaces/${params.workspaceId}/environments/${environmentId}/createLambda?tabIndex=0`}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const lambdas = this.props.lambdas.map(lambda => (
      <TableRow key={lambda.id}>
        <TableColumn>{lambda.name}</TableColumn>
        <TableColumn>{lambda.id}</TableColumn>
        <TableColumn>endpoints</TableColumn>
        <TableColumn>{lambda.properties.runtime}</TableColumn>
        <TableColumn><FontIcon>more_vert</FontIcon></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            visible={false}
            title="Lambdas"
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="lambda-listing" scale={3} centered={true} /> :
          <DataTable baseId="lambdas">
            <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>UUID</TableColumn>
                <TableColumn>Endpoints</TableColumn>
                <TableColumn>Runtime</TableColumn>
                <TableColumn />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lambdas}
            </TableBody>
          </DataTable>}
        </Card>
      </div>
    );
  }
}

export default LambdaItem;

