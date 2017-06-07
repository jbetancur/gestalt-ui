import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'components/Buttons';
import { RobotUprisingIcon } from 'components/Icons';
import P from 'components/P';

const NotFound = props => (
  <div className="flex-row">
    <div className="flex-row center-center flex-12">
      <div className="flex-row center-center">
        <h1>No Disassemble!</h1>
      </div>
      <div className="flex-row center-center">
        <P fontSize={14}>The resource you are looking for was not found!</P>
        <div className="flex-row center-center">
          <Button
            primary
            raised
            label={`Navigate back to ${props.params.fqon}`}
            onClick={() => props.router.replace(`${props.params.fqon}/hierarchy`)}
          />
        </div>
      </div>
      <RobotUprisingIcon />
    </div>
  </div>);

NotFound.propTypes = {
  router: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
  };
}

export default connect(mapStateToProps)(NotFound);
