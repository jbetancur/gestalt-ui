import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, getFormValues, isInvalid } from 'redux-form';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import FileInput from 'react-md/lib/FileInputs';
import { ExpansionList } from 'react-md/lib/ExpansionPanels';
import { ExpansionPanelNoPadding } from 'components/ExpansionList';
import AceEditor from 'components/AceEditor';
import JSONTree from 'components/JSONTree';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
import { Button } from 'components/Buttons';
import PreventAutoFill from 'components/PreventAutoFill';
import { VariablesForm } from 'modules/Variables';
import { ContainerCreate, ContainerDetails, ContainerActions } from 'modules/Containers';
import LinkedProviders from '../LinkedProviders';
import { nameMaxLen } from './validations';
import providerTypes from '../../lists/providerTypes';

const ProviderForm = (props) => {
  const { provider, change, reset, values, match, history, container, fetchEnvSchema, fetchProvidersByType } = props;
  const selectedProviderType = providerTypes.find(type => type.value === values.resource_type) || {};

  const getProviders = () => {
    const entityId = match.params.environmentId || match.params.workspaceId || null;
    const entityKey = match.params.workspaceId && match.params.enviromentId ? 'environments' : 'workspaces';
    fetchProvidersByType(match.params.fqon, entityId, entityKey);
  };

  const goBack = () => {
    if (match.params.workspaceId && !match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}`);
    } else if (match.params.environmentId) {
      history.push(`/${match.params.fqon}/hierarchy/${match.params.workspaceId}/environments/${match.params.environmentId}`);
    } else {
      history.push(`/${match.params.fqon}/providers`);
    }
  };

  const onFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      props.dispatch(change('properties.data', reader.result));
    };

    reader.readAsText(file);
  };

  const handleProviderChange = (value) => {
    const providerType = providerTypes.find(type => type.value === value);

    // no need to fetch the env schema if a container is not being required
    if (providerType && providerType.allowEnvVariables) {
      fetchEnvSchema(providerType.type);
    }

    reset();
  };

  const renderExternalProtocolSection = () => (
    selectedProviderType.externalProtocol && <Field
      id="select-return-type"
      className="flex-2 flex-xs-12 flex-sm-4"
      component={SelectField}
      name="properties.config.external_protocol"
      menuItems={[{ name: 'HTTPS', value: 'https' }, { name: 'HTTP', value: 'http' }]}
      itemLabel="name"
      itemValue="value"
      label="External Protocol"
      helpText="The protocol used to reach any externally exposed endpoints"
    />
  );

  const renderConfigAndSecuritySections = () => (
    <div className="flex-row no-gutter">
      {selectedProviderType.config &&
        <Field
          className="flex-6 flex-xs-12 flex-sm-12"
          component={TextField}
          name="properties.config.url"
          label="Provider URL/Host:Port"
          type="text"
          required
        />}
      {selectedProviderType.security &&
        <div className="flex-6 flex-xs-12 flex-sm-12 flex-row">
          <Field
            id="select-return-type"
            className="flex-4 flex-xs-12 flex-sm-4"
            component={SelectField}
            name="properties.config.auth.scheme"
            menuItems={['Basic']}
            required
            label="Security Scheme"
          />
          <Field
            className="flex-4 flex-xs-12 flex-sm-4"
            component={TextField}
            name="properties.config.auth.username"
            label="Username"
            type="text"
            required
          />
          <PreventAutoFill />
          <Field
            className="flex-4 flex-xs-12 flex-sm-4"
            component={TextField}
            name="properties.config.auth.password"
            label="Password"
            type="password"
            required
          />
        </div>}
    </div>
  );

  const renderJSONSection = () => (
    !props.envSchemaPending &&
    <div className="flex-row">
      {selectedProviderType.networking &&
      <div className="flex-6 flex-xs-12">
        <JSONTree
          data={props.provider.properties.config.networks || []}
        />
      </div>}
      {selectedProviderType.extraConfig &&
      <div className="flex-6 flex-xs-12">
        <JSONTree
          data={props.provider.properties.config.extra || {}}
        />
      </div>}
    </div>
  );

  const renderVariablesSection = () => (
    props.envSchemaPending || (selectedProviderType.type && selectedProviderType.allowEnvVariables &&
    <div className="flex-row">
      <div className="flex-6 flex-xs-12 flex-sm-12">
        <VariablesForm
          icon="public"
          addButtonLabel="Add Public Variable"
          fieldName="properties.config.env.public"
        />
      </div>
      <div className="flex-6 flex-xs-12 flex-sm-12">
        <VariablesForm
          icon="vpn_key"
          addButtonLabel="Add Private Variable"
          fieldName="properties.config.env.private"
        />
      </div>
    </div>)
  );

  const renderEditorSection = () => (
    !props.envSchemaPending &&
    <div className="flex-row">
      {selectedProviderType.uploadConfig &&
        <FileInput
          id="imageInput1"
          label="Upload YAML"
          onChange={(file, e) => onFile(file, e)}
          accept="application/x-yaml" // The IANA MIME types registry doesn't list YAML yet, so there isn't a correct one, per se.
          primary
        />}
      {selectedProviderType.uploadConfig &&
        <div className="flex-row">
          <Field
            className="flex-12"
            component={AceEditor}
            mode="yaml"
            theme="chrome"
            name="properties.data"
            maxLines={50}
            minLines={15}
            fontSize={12}
          />
        </div>}
    </div>
  );

  const renderOtherConfigSection = () => (
    !props.envSchemaPending &&
    <div className="flex-row">
      {selectedProviderType.networking &&
        <Field
          className="flex-6 flex-xs-12"
          component={TextField}
          name="properties.config.networks"
          label="Networks (JSON)"
          type="text"
          rows={2}
        />}
      {selectedProviderType.extraConfig &&
        <Field
          className="flex-6 flex-xs-12"
          component={TextField}
          name="properties.config.extra"
          label="Extra Configuration (JSON)"
          type="text"
          rows={2}
        />}
    </div>
  );

  const renderContainerSection = () => (
    selectedProviderType.allowContainer &&
      <div className="flex-row center-center">
        <Card title="Container" className="flex-10 flex-xs-12 flex-sm-12 flex-md-12">
          <CardTitle
            title="Container"
            subtitle={`The provider type: ${selectedProviderType.name} requires a container`}
          />
          <ContainerCreate match={props.match} inlineMode />
        </Card>
      </div>
  );

  const renderContainerDetailsPanel = () => (
    selectedProviderType.allowContainer && container.id &&
      <div className="flex-row center-center no-gutter">
        <Card className="flex-10 flex-xs-12 flex-sm-12 flex-md-12">
          <div className="flex-row">
            <div className="flex">
              <ContainerDetails containerModel={props.container} match={props.match} />
            </div>
          </div>
        </Card>
      </div>
  );

  const renderContainerActions = () => (
    (selectedProviderType.allowContainer && container.id) &&
      <ContainerActions
        containerModel={container}
        inContainerView
        disableDestroy
        disablePromote
        {...props}
      />
  );

  return (
    <div>
      <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card
            className="flex-10 flex-xs-12 flex-sm-12 flex-md-12"
            // expanderIconChildren="edit"
            // expanderTooltipLabel="Edit"
            // expanderIconClassName="material-icons--primary"
          >
            <CardTitle
              // expander
              title={
                <div>
                  <div>{props.title}</div>
                  {renderContainerActions()}
                </div>
              }
              subtitle={provider.id}
            />
            <CardText>
              <div className="flex-row">
                <div className="flex-row">
                  <Field
                    id="select-provider"
                    className="flex-3 flex-xs-12 flex-sm-6"
                    component={SelectField}
                    name="resource_type"
                    menuItems={providerTypes}
                    itemLabel="name"
                    itemValue="value"
                    required
                    label="Provider Type"
                    disabled={provider.id}
                    async
                    onChange={(a, value) => handleProviderChange(value)} // TODO: there is a bug with the first parram which should be the value
                  />
                  <Field
                    className="flex-3 flex-xs-12 flex-sm-6"
                    component={TextField}
                    name="name"
                    label="Name"
                    type="text"
                    required
                    maxLength={nameMaxLen}
                    disabled={provider.id}
                  />
                  <Field
                    className="flex-6 flex-xs-12 flex-sm-12"
                    component={TextField}
                    name="description"
                    label="Description"
                    type="text"
                  />
                </div>
                {renderConfigAndSecuritySections()}
                {renderExternalProtocolSection()}
                {renderEditorSection()}
                {renderVariablesSection()}
                {renderOtherConfigSection()}
                {provider.id && renderJSONSection()}
              </div>
            </CardText>
            {props.providerUpdatePending || props.envSchemaPending || props.providerPending ? <LinearProgress id="provider-form" /> : null}
            <CardActions>
              <Button
                flat
                label={props.cancelLabel}
                disabled={props.providerUpdatePending || props.providerPending || props.submitting}
                onClick={() => goBack()}
              />
              <Button
                raised
                label={props.submitLabel}
                type="submit"
                disabled={props.pristine || props.providerUpdatePending || props.envSchemaPending || props.providerPending || props.invalid || props.submitting || props.containerCreateInvalid}
                primary
              />
            </CardActions>
          </Card>
        </div>

        {!props.editMode ? <div /> : renderContainerDetailsPanel()}

        {selectedProviderType.type &&
        <div className="flex-row center-center">
          <ExpansionList className="flex-10 flex-xs-12 flex-sm-12 flex-md-12">
            <ExpansionPanelNoPadding label={<h2>Linked Providers</h2>} saveLabel="Collapse" defaultExpanded>
              <div className="flex-row">
                <div className="flex-12">
                  <LinkedProviders fetchProviders={getProviders} providersModel={props.providersByType} pending={props.providersByTypePending} />
                </div>
              </div>
            </ExpansionPanelNoPadding>
          </ExpansionList>
          {!props.editMode && renderContainerSection()}
        </div>}
      </form>
    </div>
  );
};

ProviderForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  providerPending: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  providersByType: PropTypes.array.isRequired,
  providersByTypePending: PropTypes.bool.isRequired,
  provider: PropTypes.object,
  providerUpdatePending: PropTypes.bool,
  envSchemaPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
  fetchEnvSchema: PropTypes.func.isRequired,
  fetchProvidersByType: PropTypes.func.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  containerCreateInvalid: PropTypes.bool.isRequired,
  editMode: PropTypes.bool,
  container: PropTypes.object,
};

ProviderForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel',
  provider: {},
  providerUpdatePending: false,
  editMode: false,
  container: {},
};

// Connect to this forms state in the store so we can enum the values
export default connect(
  (state, props) => ({
    values: getFormValues(props.form)(state),
    containerCreateInvalid: isInvalid('containerCreate')(state),
  })
)(ProviderForm);
