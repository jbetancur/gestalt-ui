import { connect } from 'react-redux';
import { context } from 'modules/ContextManagement';
import IntegrationsItem from '../../components/IntegrationItem';
import actions from '../../actions';

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, actions)(context(IntegrationsItem));
