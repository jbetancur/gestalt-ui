import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import APIItem from '../../components/APIItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apis: sortBy(state.metaResource.apis.apis, 'name'),
    pending: state.metaResource.apis.pending,
    selectedAPIs: state.apis.selectedAPIs,
  };
}

export default connect(mapStateToProps, actions)(APIItem);
