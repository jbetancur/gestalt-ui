import { connect } from 'react-redux';
import ProviderItem from '../../components/ProviderItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    providers: state.providers.fetchAll.providers,
    pending: state.providers.fetchAll.pending,
    selectedProviders: state.providers.selectedProviders
  };
}

export default connect(mapStateToProps, actions)(ProviderItem);
