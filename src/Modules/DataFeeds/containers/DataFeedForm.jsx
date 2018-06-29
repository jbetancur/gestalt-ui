import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import Form from 'components/Form';
import { Button } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import DataFeedSection from '../components/DataFeedSection';
import DataFeedPropertiesSection from '../components/DataFeedPropertiesSection';

const DataFeedForm = ({ handleSubmit, values, submitting, pristine, match, loading, editMode, secrets, tags }) => (
  <Form onSubmit={handleSubmit} disabled={loading}>
    <DataFeedSection />
    <DataFeedPropertiesSection
      secrets={secrets}
      formValues={values}
      tags={tags}
    />

    <FullPageFooter>
      <Button
        to={`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environment/${match.params.environmentId}/datafeeds`}
        flat
        iconChildren="arrow_back"
        component={Link}
      >
        Data Feeds
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

DataFeedForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  secrets: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
};

DataFeedForm.defaultProps = {
  editMode: false,
};

export default withRouter(DataFeedForm);
