import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { destroy } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withServiceSpec, withPickerData } from 'Modules/MetaResource';
import ServiceWizard from './ServiceWizard';

class ServiceModeler extends PureComponent {
  static propTypes = {
    serviceSpecActions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    destroyForm: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.props.destroyForm('ServiceModelerWizard');
  }

  create = (values) => {
    const { history, match, serviceSpecActions } = this.props;
    const onSuccess = () => {
      history.replace(`/${match.params.fqon}/servicespecs`);
    };

    serviceSpecActions.createServiceSpec({ fqon: match.params.fqon, payload: values, onSuccess });
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
  withServiceSpec,
  connect(null, actions),
)(ServiceModeler);
