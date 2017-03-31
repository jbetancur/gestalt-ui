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
import { FormattedDate, FormattedTime } from 'react-intl';
import { DeleteIconButton } from 'components/Buttons';

class LambdaItem extends Component {
  static propTypes = {
    lambdas: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired,
    handleSelected: PropTypes.func.isRequired,
    selectedLambdas: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    deleteLambdas: PropTypes.func.isRequired,
    confirmDelete: PropTypes.func.isRequired,
    fetchLambdas: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
    unloadLambdas: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params, fetchLambdas } = this.props;

    fetchLambdas(params.fqon, params.environmentId);
  }

  componentWillUnmount() {
    const { unloadLambdas, clearSelected } = this.props;
    unloadLambdas();
    clearSelected();
  }

  handleRowToggle(row, toggled, count) {
    const { lambdas, handleSelected, selectedLambdas } = this.props;

    handleSelected(row, toggled, count, lambdas, selectedLambdas.selectedItems);
  }

  delete() {
    const { params, deleteLambdas, clearSelected, fetchLambdas } = this.props;
    const { selectedItems } = this.props.selectedLambdas;
    const IDs = selectedItems.map(item => (item.id));
    const names = selectedItems.map(item => (item.name));

    const onSuccess = () => {
      clearSelected();
      fetchLambdas(params.fqon, params.environmentId);
    };

    this.props.confirmDelete(() => {
      deleteLambdas(IDs, params.fqon, onSuccess);
    }, names);
  }

  edit(lambda, e) {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      const { router, params } = this.props;

      router.push({
        pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/lambdas/${lambda.id}/edit`
      });
    }
  }

  renderCreateButton() {
    const { params } = this.props;

    return (
      <Button
        id="create-lambda"
        label="Create Lambda"
        flat
        primary
        component={Link}
        to={{
          pathname: `${params.fqon}/workspaces/${params.workspaceId}/environments/${params.environmentId}/lambdas/create`
        }}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  renderAPIEndpoints(lambda) {
    return lambda.properties.apiEndpoints.map(endpoint => (
      <div>
        <a key={endpoint.id} className="md-caption" href={endpoint.properties.resource} target="_blank" rel="noopener noreferrer">
          {endpoint.properties.resource}
        </a>
      </div>
    ));
  }

  render() {
    const { selectedCount } = this.props.selectedLambdas;
    const lambdas = this.props.lambdas.map(lambda => (
      <TableRow key={lambda.id} onClick={e => this.edit(lambda, e)}>
        <TableColumn>{lambda.name}</TableColumn>
        <TableColumn>{lambda.description}</TableColumn>
        <TableColumn>{lambda.id}</TableColumn>
        <TableColumn>{this.renderAPIEndpoints(lambda)}</TableColumn>
        <TableColumn>{lambda.properties.runtime}</TableColumn>
        <TableColumn>{lambda.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={lambda.created.timestamp} /> <FormattedTime value={lambda.created.timestamp} /></TableColumn>
        <TableColumn><FontIcon>more_vert</FontIcon></TableColumn>
      </TableRow>
      ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title="Lambdas"
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} lambda${selectedCount > 1 ? 's' : ''} selected`}
            actions={[<DeleteIconButton onClick={() => this.delete()} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.pending ? <LinearProgress id="lambda-listing" /> : null}
          <DataTable baseId="Lambdas" onRowToggle={(r, t, c) => this.handleRowToggle(r, t, c)}>
            {!this.props.lambdas.length ? null : <TableHeader>
              <TableRow>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>UUID</TableColumn>
                <TableColumn>Endpoints</TableColumn>
                <TableColumn>Runtime</TableColumn>
                <TableColumn>Owner</TableColumn>
                <TableColumn>Created</TableColumn>
                <TableColumn />
              </TableRow>
            </TableHeader>}
            <TableBody>
              {lambdas}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default LambdaItem;

