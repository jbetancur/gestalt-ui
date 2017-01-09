import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import { Link } from 'react-router';
import Button from 'react-md/lib/Buttons/Button';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { ExpansionList, ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/golang';
import 'brace/theme/chrome';
import 'brace/theme/monokai';
import TextField from 'components/TextField';
import SelectField from 'components/SelectField';
// import { usernameMaxLen } from '../../validations';

const LambdaForm = props => (
  <div>
    <form className="flex-row" onSubmit={props.handleSubmit(props.onSubmit)} autoComplete="off">
      <div className="flex-row center-center">
        <Card className="flex-10 flex-xs-12 flex-sm-12">
          <CardTitle title={<span>{props.title}</span>} />
          <CardText>
            <ExpansionList>
              <ExpansionPanel label="Lambda" defaultExpanded>
                <div className="flex-row">
                  <Field
                    id="select-provider"
                    className="flex-6 flex-xs-12"
                    component={SelectField}
                    name="properties.provider"
                    menuItems={['root']}
                    required
                    label="Provider"
                    errorText={props.touched && props.error}
                  />
                  <div className="flex-row">
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="name"
                      label="Name"
                      type="text"
                      required
                      errorText={props.touched && props.error}
                      // maxLength={usernameMaxLen}
                      lineDirection="center"
                    />
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="description"
                      label="Description"
                      type="text"
                      required
                      errorText={props.touched && props.error}
                      // maxLength={usernameMaxLen}
                      lineDirection="center"
                    />
                    <Field
                      id="select-runtime"
                      className="flex-2 flex-xs-12"
                      component={SelectField}
                      name="properties.runtime"
                      menuItems={['root']}
                      required
                      label="Runtime"
                      errorText={props.touched && props.error}
                    />
                    <Field
                      id="select-code-type"
                      className="flex-2 flex-xs-12"
                      component={SelectField}
                      name="properties.code_type"
                      menuItems={['root']}
                      required
                      label="Inline Code"
                      errorText={props.touched && props.error}
                    />
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="properties.package_url"
                      label="Package URL"
                      type="text"
                      required
                      errorText={props.touched && props.error}
                      lineDirection="center"
                    />
                    <Field
                      className="flex-2 flex-xs-12"
                      id="compressed-packageurl"
                      component={Checkbox}
                      name="properties.compressed"
                      label="Compressed"
                    />
                    <Field
                      className="flex-6 flex-xs-12"
                      component={TextField}
                      name="properties.handler"
                      label="Handler"
                      type="text"
                      required
                      errorText={props.touched && props.error}
                      lineDirection="center"
                    />
                    <Field
                      id="select-return-type"
                      className="flex-5 flex-xs-12"
                      component={SelectField}
                      name="properties.headers"
                      menuItems={['root']}
                      required
                      label="Return Type"
                      errorText={props.touched && props.error}
                    />
                    <Field
                      className="flex-1 flex-xs-12"
                      component={TextField}
                      name="properties.timeout"
                      label="Timeout"
                      type="number"
                      required
                      errorText={props.touched && props.error}
                      lineDirection="center"
                    />
                    <Field
                      className="flex-2 flex-xs-12"
                      id="syncronous"
                      component={Checkbox}
                      name="properties.syncronous"
                      label="Syncronous"
                    />
                    <Field
                      className="flex-2 flex-xs-12"
                      id="public"
                      component={Checkbox}
                      name="properties.public"
                      label="Public"
                    />
                    <Field
                      component={AceEditor}
                      mode="javascript"
                      theme="chrome"
                      name="properties.code"
                      width="100%"
                      height="100%"
                      maxLines={25}
                      minLines={25}
                      // ref="ace"
                      fontSize={14}
                      editorProps={{ $blockScrolling: Infinity }}
                      onLoad={(editor) => {
                        editor.focus();
                        editor.getSession().setUseWrapMode(true);
                      }}
                    />
                  </div>
                </div>
              </ExpansionPanel>
              <ExpansionPanel label="Variables">
                Variables
              </ExpansionPanel>
              <ExpansionPanel label="Associate Endpoints">
                Endpoints
              </ExpansionPanel>
            </ExpansionList>

          </CardText>
          {props.updatePending ? <LinearProgress id="user-form" /> : null}
          <CardActions>
            <Button
              flat
              label={props.cancelLabel}
              disabled={props.pending || props.submitting}
              component={Link}
              to={`${props.params.fqon}/workspaces/${props.params.workspaceId}/environments/${props.params.environmentId}?tabIndex=${props.location.query.tabIndex}`}
            />
            <Button
              raised
              label={props.submitLabel}
              type="submit"
              disabled={props.pristine || props.pending || props.invalid || props.submitting}
              primary
            />
          </CardActions>
        </Card>
      </div>
    </form>
  </div>
);

LambdaForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  updatePending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.string,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};

LambdaForm.defaultProps = {
  title: '',
  submitLabel: '',
  cancelLabel: 'Cancel'
};

export default LambdaForm;
