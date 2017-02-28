import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import APIEndpointItem from '../../components/APIEndpointItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apiEndpoints: sortBy(state.apiEndpoints.fetchAll.apiEndpoints, 'name'),
    pending: state.apiEndpoints.fetchAll.pending,
    selectedEndpoints: state.apiEndpoints.selectedEndpoints,
  };
}

export default connect(mapStateToProps, actions)(APIEndpointItem);
