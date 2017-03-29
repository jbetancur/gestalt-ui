import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import LambdaItem from '../../components/LambdaItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    lambdas: sortBy(state.metaResource.lambdas.lambdas, 'name'),
    pending: state.metaResource.lambdas.pending,
    selectedLambdas: state.lambdas.selectedLambdas,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(LambdaItem);
