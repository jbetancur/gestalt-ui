import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LambdaItem from '../../components/LambdaItem';
import * as actions from '../../actions';

class Lambdas extends Component {
  static propTypes = {
    fetchLambdas: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    fqon: PropTypes.string.isRequired,
    environmentId: PropTypes.string.isRequired,
    onUnloadListing: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const fqon = this.props.fqon || this.props.router.params.fqon;
    const environmentId = this.props.environmentId || this.props.router.params.environmentId;
    this.props.fetchLambdas(fqon, environmentId);
  }

  componentWillUnmount() {
    const { onUnloadListing, clearSelected } = this.props;
    onUnloadListing();
    clearSelected();
  }

  render() {
    return <LambdaItem {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    lambdas: state.lambdas.fetchAll.lambdas,
    pending: state.lambdas.fetchAll.pending,
    selectedLambdas: state.lambdas.selectedLambdas,
  };
}

export default connect(mapStateToProps, actions)(Lambdas);
