import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { metaActions } from 'modules/MetaResource';
import ContainerItem from '../../components/ContainerItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    containers: sortBy(state.containers.fetchAll.containers, 'name'),
    pending: state.containers.fetchAll.pending,
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(ContainerItem);
