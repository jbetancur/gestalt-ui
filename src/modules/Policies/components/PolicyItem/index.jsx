import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FontIcon from 'react-md/lib/FontIcons';
import { FormattedDate, FormattedTime } from 'react-intl';
import { Button, DeleteIconButton } from 'components/Buttons';

class PolicyItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    selectedPolicies: PropTypes.object.isRequired,
    policiesPending: PropTypes.bool.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedPolicies } = this.props;

    handleTableSelected(row, toggled, count, model, selectedPolicies.selectedItems);
  }

  renderCreateButton() {
    return (
      <Button
        id="create-policy"
        label="Create Policy"
        flat
        primary
        onClick={this.props.onCreateToggle}
      >
        <FontIcon>add</FontIcon>
      </Button>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedPolicies;
    const { handleTableSortIcon, sortTable } = this.props;

    const policies = this.props.model.map(policy => (
      <TableRow key={policy.id} onClick={e => this.props.onEditToggle(policy, e)}>
        <TableColumn>{policy.name}</TableColumn>
        <TableColumn>{policy.description}</TableColumn>
        <TableColumn>{policy.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policy.created.timestamp} /> <FormattedTime value={policy.created.timestamp} /></TableColumn>
      </TableRow>
    ));

    return (
      <div className="flex-row">
        <Card className="flex-12" tableCard>
          <TableCardHeader
            title={<div className="gf-headline">Policies</div>}
            visible={selectedCount > 0}
            contextualTitle={`${selectedCount} polic${selectedCount > 1 ? 'ies' : 'y'} selected`}
            actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
          >
            <div>{this.renderCreateButton()}</div>
          </TableCardHeader>
          {this.props.policiesPending && <LinearProgress id="policy-listing" />}
          <DataTable baseId="policies" onRowToggle={this.handleRowToggle}>
            {this.props.model.length > 0 &&
            <TableHeader>
              <TableRow>
                <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
                <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
                <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
                <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
              </TableRow>
            </TableHeader>}
            <TableBody>
              {policies}
            </TableBody>
          </DataTable>
        </Card>
      </div>
    );
  }
}

export default PolicyItem;
