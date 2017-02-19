import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContainerItem from '../../components/ContainerItem';

import * as actions from '../../actions';

class Containers extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fetchContainers: PropTypes.func.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.params.fqon;
    const environmentId = this.props.environmentId || this.props.params.environmentId;
    this.props.fetchContainers(fqon, environmentId);
  }

  render() {
    return <ContainerItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    containers: state.containers.fetchAll.containers,
    pending: state.containers.fetchAll.pending,
  };
}

export default connect(mapStateToProps, actions)(Containers);
