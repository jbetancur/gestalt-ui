import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Card } from 'react-md';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import ResourceTypeItem from '../components/ResourceTypeItem';
// import actions from '../../actions';

class ResourceTypeListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchResourceTypes: PropTypes.func.isRequired,
    fetchResourceType: PropTypes.func.isRequired,
    resourceTypes: PropTypes.array.isRequired,
    resourceTypesPending: PropTypes.bool.isRequired,
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
    // const { match, deleteResourceTypes, tableActions, fetchResourceTypes } = this.props;
    // const { items } = this.props.tableManager.tableSelected;
    // const IDs = items.map(item => (item.id));
    // const names = items.map(item => (item.name));

    // const onSuccess = () => {
    //   tableActions.clearTableSelected();
    //   fetchResourceTypes(match.params.fqon, match.params.environmentId);
    // };

    // this.props.confirmDelete(() => {
    //   deleteResourceTypes(IDs, match.params.fqon, onSuccess);
    // }, names);
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

export default connect()(withMetaResource(ResourceTypeListing));
