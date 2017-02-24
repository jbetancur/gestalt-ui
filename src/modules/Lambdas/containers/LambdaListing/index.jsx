import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import LambdaItem from '../../components/LambdaItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    lambdas: sortBy(state.lambdas.fetchAll.lambdas, 'name'),
    pending: state.lambdas.fetchAll.pending,
    selectedLambdas: state.lambdas.selectedLambdas,
  };
}

export default connect(mapStateToProps, actions)(LambdaItem);
