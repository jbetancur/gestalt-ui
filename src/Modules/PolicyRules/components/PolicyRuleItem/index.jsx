import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader, TableColumnTimestamp } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { DeleteIconButton } from 'components/Buttons';
import { truncate } from 'util/helpers/strings';
import policyTypes from '../../lists/policyTypes';

class PolicyRuleItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
    getTableSortedItems: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleRowToggle = (row, toggled, count) => {
    const { model, tableActions, tableManager } = this.props;

    tableActions.handleTableSelected(row, toggled, count, model, tableManager.tableSelected.items);
  }

  renderCreateMenuItems() {
    return policyTypes.map(type => (
      <ListItem
        key={type.value}
        primaryText={type.displayName}
        onClick={() => this.props.onCreateToggle(type)}
      />)
    );
  }

  renderCreateButton() {
    return (
      <MenuButton
        id="create-policyRule"
        label="Create Policy Rule"
        flat
        primary
        fullWidth
        position="below"
        iconChildren="add"
      >
        {this.renderCreateMenuItems()}
      </MenuButton>
    );
  }

  render() {
    const { count } = this.props.tableManager.tableSelected;
    const { model, tableActions, getTableSortedItems } = this.props;

    const policyRules = getTableSortedItems(model, 'name').map(policyRule => (
      <TableRow key={policyRule.id} onClick={e => this.props.onEditToggle(policyRule, e)}>
        <TableColumn>{policyRule.name}</TableColumn>
        <TableColumn>{truncate(policyRule.description, 100)}</TableColumn>
        <TableColumn>{policyRule.resource_type.split('::')[policyRule.resource_type.split('::').length - 1]}</TableColumn>
        <TableColumn>{policyRule.owner.name}</TableColumn>
        <TableColumnTimestamp timestamp={policyRule.created.timestamp} />
      </TableRow>
    ));

    return (
      <Card tableCard>
        <TableCardHeader
          title={<div className="gf-headline">Policy Rules</div>}
          visible={count > 0}
          contextualTitle={`${count} policy rule${count > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.policyRulesPending && <LinearProgress id="policyRule-listing" />}
        <DataTable baseId="policyRules" onRowToggle={this.handleRowToggle}>
          {this.props.model.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn sorted={tableActions.handleTableSortIcon('name', true)} onClick={() => tableActions.sortTable('name')}>Name</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('description')} onClick={() => tableActions.sortTable('description')}>Description</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('resource_type')} onClick={() => tableActions.sortTable('resource_type')}>Type</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('owner.name')} onClick={() => tableActions.sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={tableActions.handleTableSortIcon('created.timestamp')} onClick={() => tableActions.sortTable('created.timestamp')}>Created</TableColumn>
            </TableRow>
          </TableHeader>}
          <TableBody>
            {policyRules}
          </TableBody>
        </DataTable>
      </Card>
    );
  }
}

export default PolicyRuleItem;
