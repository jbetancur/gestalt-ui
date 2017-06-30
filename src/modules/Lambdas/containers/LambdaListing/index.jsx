import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import { context } from 'modules/ContextManagement';
import { withMetaResource } from 'modules/MetaResource';
import { tableActions } from 'modules/TableManager';
import LambdaItem from '../../components/LambdaItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    lambdas: orderBy(state.metaResource.lambdas.lambdas, state.tableManager.tableSort.key || 'name', state.tableManager.tableSort.order),
    selectedLambdas: state.tableManager.tableSelected,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, tableActions))(context(LambdaItem)));
