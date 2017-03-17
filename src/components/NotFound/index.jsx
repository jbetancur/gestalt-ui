import React from 'react';
import { RobotUprisingIcon } from 'components/Icons';
import P from 'components/P';

const NotFound = () => (
  <div className="flex-row">
    <div className="flex-row center-center flex-12">
      <div className="flex-row center-center">
        <h1>No Dissassemble!</h1>
      </div>
      <div className="flex-row center-center">
        <P>Aw Snap! The resource you are looking for was not found!</P>
      </div>
      <RobotUprisingIcon />
    </div>
  </div>);

export default NotFound;
