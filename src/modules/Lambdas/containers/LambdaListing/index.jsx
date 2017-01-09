import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LambdaItem from '../../components/LambdaItem';

import * as actions from '../../actions';

class Lambdas extends Component {
  static propTypes = {
    fetchLambdas: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    const environmentId = this.props.environmentId || this.props.router.params.environmentId;
    this.props.fetchLambdas(fqon, environmentId);
  }

  render() {
    return (
      <div>
        <LambdaItem {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lambdas: state.lambdas.fetchAll.items,
    pending: state.lambdas.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(Lambdas);
