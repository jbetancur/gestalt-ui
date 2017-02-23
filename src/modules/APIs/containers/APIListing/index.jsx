import { connect } from 'react-redux';
import APIItem from '../../components/APIItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    apis: state.apis.fetchAll.apis,
    pending: state.apis.fetchAll.pending,
    selectedAPIs: state.apis.selectedAPIs,
  };
}

export default connect(mapStateToProps, actions)(APIItem);
