import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Row, Col } from 'react-flexybox';
import { Card } from 'react-md';
import { withMetaResource } from 'Modules/MetaResource';
import { withTableManager } from 'Modules/TableManager';
import ServiceSpecItem from '../components/ServiceSpecItem';

class ResourceTypeListing extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    fetchServiceSpecs: PropTypes.func.isRequired,
    fetchResourceType: PropTypes.func.isRequired,
    unloadServiceSpecs: PropTypes.func.isRequired,
    serviceSpecs: PropTypes.array.isRequired,
    serviceSpecsPending: PropTypes.bool.isRequired,
    deleteserviceSpecs: PropTypes.func.isRequired,
    tableManager: PropTypes.object.isRequired,
    tableActions: PropTypes.object.isRequired,
    resourceTypeActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, fetchServiceSpecs } = this.props;

    fetchServiceSpecs(match.params.fqon);
  }

  componentWillUnmount() {
    const { unloadServiceSpecs } = this.props;

    unloadServiceSpecs();
  }

  edit = (serviceSpecId, e) => {
    // TODO: workaround for checkbox event bubbling
    if (e.target.className.includes('md-table-column')) {
      // const { history, match } = this.props;

      // history.push(`${match.url}/${serviceSpecId.id}`);
    }
  }

  delete = () => {
    const { match, deleteserviceSpecs, tableActions, fetchServiceSpecs, resourceTypeActions } = this.props;
    const { items } = this.props.tableManager.tableSelected;
    const IDs = items.map(item => (item.id));
    const names = items.map(item => (item.name));

    const onSuccess = () => {
      tableActions.clearTableSelected();
      fetchServiceSpecs(match.params.fqon, match.params.environmentId);
    };

    resourceTypeActions.confirmDelete(() => {
      deleteserviceSpecs(IDs, match.params.fqon, onSuccess);
    }, names);
  }

  render() {
    return (
      <Row gutter={5}>
        <Col component={Card} flex={12}>
          <ServiceSpecItem
            model={this.props.serviceSpecs}
            pending={this.props.serviceSpecsPending}
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
)(ResourceTypeListing);
