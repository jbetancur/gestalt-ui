import { connect } from 'react-redux';
import { metaActions } from 'modules/MetaResource';
import { sortBy } from 'lodash';
import ProviderItem from '../../components/ProviderItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    providers: sortBy(state.metaResource.providers.providers, 'name'),
    pending: state.metaResource.providers.pending,
    selectedProviders: state.providers.selectedProviders
  };
}

export default connect(mapStateToProps, Object.assign({}, actions, metaActions))(ProviderItem);
