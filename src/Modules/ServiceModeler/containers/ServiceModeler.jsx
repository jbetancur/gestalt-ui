import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withMetaResource } from 'Modules/MetaResource';
import ServiceWizard from './ServiceWizard';

class ServiceModeler extends PureComponent {
  static propTypes = {
    fetchResourceTypesDropDown: PropTypes.func.isRequired,
    createServiceSpec: PropTypes.func.isRequired,
    fetchLambdasDropDown: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchResourceTypesDropDown('root');
    this.props.fetchLambdasDropDown(this.props.match.params.fqon);
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

export default compose(
  withMetaResource,
)(ServiceModeler);
