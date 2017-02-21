import { connect } from 'react-redux';
import ContainerItem from '../../components/ContainerItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    containers: state.containers.fetchAll.containers,
    pending: state.containers.fetchAll.pending,
  };
}

export default connect(mapStateToProps, actions)(ContainerItem);
