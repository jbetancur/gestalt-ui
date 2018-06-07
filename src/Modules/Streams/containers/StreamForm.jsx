import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import StreamSection from '../components/StreamSection';
import StreamPropertiesSection from '../components/StreamPropertiesSection';

const StreamForm = ({ loading, editMode, handleSubmit, pristine, submitting, match, lambdas, datafeeds, providers }) => (
  <Form onSubmit={handleSubmit} disabled={loading}>
    <StreamSection providers={providers} editMode={editMode} />
    <StreamPropertiesSection lambdas={lambdas} datafeeds={datafeeds} editMode={editMode} />
    <FullPageFooter>
      <Button
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/streamspecs`}
        flat
        component={Link}
        iconChildren="arrow_back"
      >
        Stream Specs
      </Button>

      <Button
        type="submit"
        primary
        raised
        disabled={submitting || pristine}
      >
        {editMode ? 'Update' : 'Create'}
      </Button>
    </FullPageFooter>
  </Form>
);

StreamForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  lambdas: PropTypes.array.isRequired,
  datafeeds: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  editMode: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
};

StreamForm.defaultProps = {
  editMode: false,
};

export default withRouter(StreamForm);
