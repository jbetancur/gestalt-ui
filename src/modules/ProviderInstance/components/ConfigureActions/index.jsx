import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
// import Divider from 'react-md/lib/Dividers';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import AceEditor from 'react-ace';
// import FontIcon from 'react-md/lib/FontIcons';
import { Button } from 'components/Buttons';

// eslint-disable-next-line
const payload = {"name":"example-actions-lambda","properties":{"env":{"qweqw":"eqweq"},"headers":{"Accept":"text/plain"},"code":"ZnVuY3Rpb24gaGVsbG8oKSB7CiAgICByZXR1cm4gJ0hlbGxvIFdvcmxkISc7Cn0=","code_type":"code","cpus":0.1,"memory":512,"timeout":30,"handler":"hello","public":true,"runtime":"nodejs","provider":{"id":"9d851c2b-1fe3-4620-9f23-3018558bb087","locations":[]}},"description":"this is an example"}

const EnhancedAceEditor = styled(AceEditor)`
  // Fixes font for ace editor
  .ace_line {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;

      span {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      }
  }
`;

export default class ConfigureActions extends PureComponent {
  constructor() {
    super();

    this.state = {
      name: '',
      description: '',
      type: '',
      resource: '',
      actions: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      actions: [...this.state.actions, {
        name: this.state.name,
        description: this.state.description,
        type: this.state.type,
        resource: this.state.resourcei,
      }]
    });

    this.setState({
      name: '',
      description: '',
      type: '',
      resource: '',
    });
  }

  render() {
    const rows = [...this.state.actions.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.name}</TableColumn>
        <TableColumn>{item.description}</TableColumn>
        <TableColumn>{item.type}</TableColumn>
      </TableRow>
    ))];

    return (
      <form className="flex-row center-center">
        <div className="flex-6 flex-xs-12">
          <div className="gf-headline-1">Actions</div>
          <div className="flex-6 flex-row">
            <TextField
              className="flex-6"
              label="Action Name"
              value={this.state.name}
              onChange={value => this.setState({ name: value })}
            />
            <TextField
              className="flex-6"
              label="Action Description"
              value={this.state.description}
              onChange={value => this.setState({ description: value })}
            />
            <SelectField
              className="flex-6"
              label="Maps To"
              menuItems={['Lambda', 'Container']}
              value={this.state.type}
              onChange={value => this.setState({ type: value })}
            />
            {this.state.type === 'Lambda' &&
              <SelectField
                className="flex-6"
                label="Code Type"
                menuItems={['Inline']}
                value={this.state.resource}
                onChange={value => this.setState({ resource: value })}
              />}
            {this.state.type === 'Container' &&
              <TextField
                className="flex-6"
                label="URL"
              />}
          </div>


          {(this.state.resource === 'Inline' && this.state.type === 'Lambda') &&
          <EnhancedAceEditor
            className="flex-12"
            maxLines={10}
            minLines={10}
            mode="json"
            width="100%"
            height="100%"
            showPrintMargin={false}
            highlightActiveLine={true}
            defaultValue={JSON.stringify(payload, null, 2)}
          />}

          <div className="flex-row center-center">
            <Checkbox
              className="flex-3"
              label="organization.detail"
              id="organization.detail"
              name="organization.detail"
            />
            <Checkbox
              className="flex-3"
              label="organization.list"
              id="organization.list"
              name="organization.list"
            />
            <Checkbox
              className="flex-3"
              label="workspace.detail"
              id="workspace.detail"
              name="workspace.detail"
            />
            <Checkbox
              className="flex-3"
              label="workspace.list"
              id="workspace.list"
              name="workspace.list"
            />
            <Checkbox
              className="flex-3"
              label="environment.detail"
              id="environment.detail"
              name="environment.detail"
            />
            <Checkbox
              className="flex-3"
              label="environment.list"
              id="environment.list"
              name="environment.list"
            />
            <Checkbox
              className="flex-3"
              label="lambda.detail"
              id="lambda.detail"
              name="lambda.detail"
            />
            <Checkbox
              className="flex-3"
              label="lambda.list"
              id="lambda.list"
              name="lambda.list"
            />
            <Checkbox
              className="flex-3"
              label="container.detail"
              id="container.detail"
              name="container.detail"
            />
            <Checkbox
              className="flex-3"
              label="container.list"
              id="container.list"
              name="container.list"
            />
            <Checkbox
              className="flex-3"
              label="policy.list"
              id="policy.list"
              name="policy.list"
            />
            <Checkbox
              className="flex-3"
              label="policy.detail"
              id="policy.detailL"
              name="policy.detail"
            />
            <Checkbox
              className="flex-3"
              label="entitlements"
              id="acls"
              name="acls"
            />
            <Checkbox
              className="flex-3"
              label="External URL"
              id="External-URL"
              name="External-URL"
            />
          </div>
          <div className="flex-row center-center">
            <Button
              raised
              primary
              type="submit"
              onClick={this.handleSubmit}
            >
              Add Action
            </Button>
          </div>

          <div className="flex-row center-center">
            {this.state.actions.length > 0 &&
              <div>
                <DataTable plain>
                  <TableHeader>
                    <TableRow>
                      <TableColumn>Name</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Maps To</TableColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows}
                  </TableBody>
                </DataTable>
              </div>}
          </div>
        </div>
      </form>
    );
  }
}
