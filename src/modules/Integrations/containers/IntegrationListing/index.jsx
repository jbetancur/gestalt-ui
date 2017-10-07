import { connect } from 'react-redux';
import { withContext } from 'Modules/ContextManagement';
import IntegrationsItem from '../../components/IntegrationItem';
import actions from '../../actions';

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, actions)(withContext(IntegrationsItem));
