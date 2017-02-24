import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import ProviderItem from '../../components/ProviderItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    providers: sortBy(state.providers.fetchAll.providers, 'name'),
    pending: state.providers.fetchAll.pending,
    selectedProviders: state.providers.selectedProviders
  };
}

export default connect(mapStateToProps, actions)(ProviderItem);
