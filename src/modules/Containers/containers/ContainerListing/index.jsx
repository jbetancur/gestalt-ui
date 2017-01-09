import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ContainerItem from '../../components/ContainerItem';

import * as actions from '../../actions';

class Containers extends Component {
  static propTypes = {
    fetchContainers: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    const environmentId = this.props.environmentId || this.props.router.params.environmentId;
    this.props.fetchContainers(fqon, environmentId);
  }

  render() {
    return (
      <div>
        <ContainerItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    containers: state.containers.fetchAll.items,
    pending: state.containers.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Containers);
