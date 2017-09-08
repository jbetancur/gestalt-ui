import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-md/lib/Cards/Card';
import { DataTable, TableHeader, TableBody, TableColumn, TableRow, TableCardHeader } from 'components/Tables';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import { FormattedDate, FormattedTime } from 'react-intl';
import { DeleteIconButton } from 'components/Buttons';
import { truncate } from 'util/helpers/strings';
import policyTypes from '../../lists/policyTypes';

class PolicyRuleItem extends PureComponent {
  static propTypes = {
    onEditToggle: PropTypes.func.isRequired,
    onCreateToggle: PropTypes.func.isRequired,
    onDeleteToggle: PropTypes.func.isRequired,
    model: PropTypes.array.isRequired,
    selectedPolicyRules: PropTypes.object.isRequired,
    policyRulesPending: PropTypes.bool.isRequired,
    handleTableSortIcon: PropTypes.func.isRequired,
    handleTableSelected: PropTypes.func.isRequired,
    sortTable: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleRowToggle = this.handleRowToggle.bind(this);
  }

  handleRowToggle(row, toggled, count) {
    const { model, handleTableSelected, selectedPolicyRules } = this.props;

    handleTableSelected(row, toggled, count, model, selectedPolicyRules.selectedItems);
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
        buttonChildren="add"
      >
        {this.renderCreateMenuItems()}
      </MenuButton>
    );
  }

  render() {
    const { selectedCount } = this.props.selectedPolicyRules;
    const { handleTableSortIcon, sortTable } = this.props;

    const policyRules = this.props.model.map(policyRule => (
      <TableRow key={policyRule.id} onClick={e => this.props.onEditToggle(policyRule, e)}>
        <TableColumn>{policyRule.name}</TableColumn>
        <TableColumn>{truncate(policyRule.description, 100)}</TableColumn>
        <TableColumn>{policyRule.resource_type.split('::')[policyRule.resource_type.split('::').length - 1]}</TableColumn>
        <TableColumn>{policyRule.owner.name}</TableColumn>
        <TableColumn><FormattedDate value={policyRule.created.timestamp} /> <FormattedTime value={policyRule.created.timestamp} /></TableColumn>
      </TableRow>
    ));

    return (
      <Card tableCard>
        <TableCardHeader
          title={<div className="gf-headline">Policy Rules</div>}
          visible={selectedCount > 0}
          contextualTitle={`${selectedCount} policy rule${selectedCount > 1 ? 's' : ''} selected`}
          actions={[<DeleteIconButton onClick={this.props.onDeleteToggle} />]}
        >
          <div>{this.renderCreateButton()}</div>
        </TableCardHeader>
        {this.props.policyRulesPending && <LinearProgress id="policyRule-listing" />}
        <DataTable baseId="policyRules" onRowToggle={this.handleRowToggle}>
          {this.props.model.length > 0 &&
          <TableHeader>
            <TableRow>
              <TableColumn sorted={handleTableSortIcon('name', true)} onClick={() => sortTable('name')}>Name</TableColumn>
              <TableColumn sorted={handleTableSortIcon('description')} onClick={() => sortTable('description')}>Description</TableColumn>
              <TableColumn sorted={handleTableSortIcon('resource_type')} onClick={() => sortTable('resource_type')}>Type</TableColumn>
              <TableColumn sorted={handleTableSortIcon('owner.name')} onClick={() => sortTable('owner.name')}>Owner</TableColumn>
              <TableColumn sorted={handleTableSortIcon('created.timestamp')} onClick={() => sortTable('created.timestamp')}>Created</TableColumn>
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
