import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Card } from 'react-md';
// import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import ResourceTypeItem from '../components/ResourceTypeItem';
import withResourceTypes from '../withResourceTypes';

class ResourceTypeListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchResourceTypes: PropTypes.func.isRequired,
    fetchResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    resourceTypesPending: PropTypes.bool.isRequired,
    deleteResourceTypes: PropTypes.func.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    resourceTypeActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchResourceTypes } = this.props;

    fetchResourceTypes('root');
  }

  edit = () => {
    // const { fetchResourceType } = this.props;

    // // TODO: workaround for checkbox event bubbling
    // if (e.target.className.includes('md-table-column')) {
    //   fetchResourceType('root', resourceType.id);
    // }
  }

  delete = () => {
    const { match, deleteResourceTypes, tableActions, fetchResourceTypes, resourceTypeActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchResourceTypes(match.params.fqon, match.params.environmentId);
    };

    resourceTypeActions.confirmDelete(() => {
      deleteResourceTypes(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <ResourceTypeItem
            model={this.props.resourceTypes}
            pending={this.props.resourceTypesPending}
            onEditToggle={this.edit}
            onDeleteToggle={this.delete}
            {...this.props}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  withMetaResource,
  withTableManager,
  withResourceTypes
)(ResourceTypeListing);
