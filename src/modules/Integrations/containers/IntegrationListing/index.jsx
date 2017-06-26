import { connect } from 'react-redux';
import { context } from 'modules/ContextManagement';
import IntegrationsItem from '../../components/IntegrationItem';
import actions from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations.fetchAll.integrations,
    pending: state.integrations.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(context(IntegrationsItem));
