import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import APIEndpointItem from '../../components/APIEndpointItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apiEndpoints: sortBy(state.metaResource.apiEndpoints.apiEndpoints, 'name'),
    pending: state.metaResource.apiEndpoints.pending,
    selectedEndpoints: state.apiEndpoints.selectedEndpoints,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(APIEndpointItem);
