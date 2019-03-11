import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { LambdaProvider } from './LambdaContext';
import { getCreateLambdaModel } from '../reducers/selectors';
import withLambda from '../hocs/withLambda';

class LambdaMain extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <LambdaProvider>
        {children}
      </LambdaProvider>
    );
  }
}

const mapStateToProps = state => ({
  initialFormValues: getCreateLambdaModel(state),
  theme: state.lambdas.theme,
});

export default compose(
  withLambda(),
  connect(mapStateToProps),
)(LambdaMain);
