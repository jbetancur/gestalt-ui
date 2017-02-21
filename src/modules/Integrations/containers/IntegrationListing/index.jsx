import { connect } from 'react-redux';
import IntegrationsItem from '../../components/IntegrationItem';
import * as actions from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations.fetchAll.integrations,
    pending: state.integrations.fetchAll.pending
  };
}

export default connect(mapStateToProps, actions)(IntegrationsItem);
