import React from 'react';
import PropTypes from 'prop-types';
import StreamSection from './StreamSection';
import StreamPropertiesSection from './StreamPropertiesSection';

const StreamForm = ({ editMode, lambdas, datafeeds, providers }) => (
  <React.Fragment>
    <StreamSection providers={providers} editMode={editMode} />
    <StreamPropertiesSection lambdas={lambdas} datafeeds={datafeeds} editMode={editMode} />
  </React.Fragment>
);

StreamForm.propTypes = {
  lambdas: PropTypes.array.isRequired,
  datafeeds: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
};

StreamForm.defaultProps = {
  editMode: false,
};

export default StreamForm;
