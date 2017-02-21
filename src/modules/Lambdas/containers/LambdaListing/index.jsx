import { connect } from 'react-redux';
import LambdaItem from '../../components/LambdaItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    lambdas: state.lambdas.fetchAll.lambdas,
    pending: state.lambdas.fetchAll.pending,
    selectedLambdas: state.lambdas.selectedLambdas,
  };
}

export default connect(mapStateToProps, actions)(LambdaItem);
