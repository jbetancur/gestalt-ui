import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withMetaResource, withPickerData } from 'Modules/MetaResource';
import ServiceWizard from './ServiceWizard';

class ServiceModeler extends PureComponent {
  static propTypes = {
    createServiceSpec: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    destroyForm: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.destroyForm('ServiceModelerWizard');
  }

  create = (values) => {
    const { history, match, createServiceSpec } = this.props;
    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/servicespecs`);
    };

    createServiceSpec(this.props.match.params.fqon, values, onSuccess);
  }

  render() {
    return <ServiceWizard onSubmit={this.create} {...this.props} />;
  }
}

const actions = dispatch => ({
  destroyForm: (form) => {
    dispatch(destroy(form));
  }
});

export default compose(
  withPickerData({ entity: 'resourcetypes', label: 'Resource Types', context: false }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withMetaResource,
  connect(null, actions),
)(ServiceModeler);
