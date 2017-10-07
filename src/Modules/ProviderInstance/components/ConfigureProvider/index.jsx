import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import TextField from 'react-md/lib/TextFields';
// import SelectField from 'react-md/lib/SelectFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import FontIcon from 'react-md/lib/FontIcons';
// import Divider from 'react-md/lib/Dividers';
import AceEditor from 'components/AceEditor';
import { Button } from 'components/Buttons';
import 'brace/mode/json';

// eslint-disable-next-line
const payload = {"name":"my-action-container","description":"this is an action container","properties":{"env":{"qweqw":"eqweq"},"labels":{},"volumes":[],"port_mappings":[{"protocol":"tcp","expose_endpoint":true,"name":"web","container_port":80}],"health_checks":[],"provider":{"locations":[],"id":"1cdee59d-c0d0-448c-b6e3-aed706eb7237"},"container_type":"DOCKER","force_pull":false,"cpus":0.1,"memory":128,"num_instances":1,"network":"BRIDGE","image":"nginx"}}

export default class ConfigureProvider extends Component {
  constructor() {
    super();

    this.state = {
      requiresContainer: false,
      envName: '',
      envDefaultValue: '',
      envPrivate: false,
      schema: [],
    };

    this.addSchemaItem = this.addSchemaItem.bind(this);
  }

  addSchemaItem(e) {
    e.preventDefault();

    this.setState({
      schema: [...this.state.schema, {
        name: this.state.envName,
        defaultValue: this.state.envDefaultValue,
        private: this.state.envPrivate,
      }]
    });

    this.setState({
      envName: '',
      envDefaultValue: '',
      envPrivate: false,
    });
  }

  render() {
    const rows = [...this.state.schema.map((item, i) => (
      <TableRow key={i}>
        <TableColumn>{item.name}</TableColumn>
        <TableColumn>{item.defaultValue}</TableColumn>
        <TableColumn>{item.private && <FontIcon>check</FontIcon>}</TableColumn>
      </TableRow>
    ))];

    return (
      <form>
        <Row gutter={5}>
          <Col flex={6} xs={12}>
            <div className="gf-headline-1">Configuration</div>
            <div className="flex-6 flex-row">
              <TextField
                className="flex-6"
                label="Provider Name"
                helpText="Name of the Provider"
              />
              <TextField
                className="flex-6"
                label="Provider Type"
                helpText="ex: Provider::Example"
              />
            </div>

            <div className="flex-6 flex-row">
              <Checkbox
                className="flex-3"
                label="Requires Container"
                id="requires-container"
                name="requires-container"
                value={this.state.requiresContainer}
                onChange={() => this.setState({ requiresContainer: !this.state.requiresContainer })}
              />
              {this.state.requiresContainer &&
              <AceEditor
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
            </div>

            <div className="gf-headline-1">Environment Schema</div>
            <div className="flex-6 flex-row">
              <TextField
                className="flex-4"
                label="Name"
                value={this.state.envName}
                id="name"
                onChange={value => this.setState({ envName: value })}
              />
              <TextField
                className="flex-4"
                label="Default Value"
                value={this.state.envDefaultValue}
                id="defaultValue"
                onChange={value => this.setState({ envDefaultValue: value })}
              />
              <Checkbox
                className="flex-2"
                label="Private"
                id="pubpriv"
                name="pubpriv"
                checked={this.state.envPrivate}
                onChange={() => this.setState({ envPrivate: !this.state.envPrivate })}
              />
              <Button
                floating
                primary
                iconChildren="add"
                type="submit"
                onClick={this.addSchemaItem}
              >
                Add Environment Variable
              </Button>

              <Row gutter={5} center>
                {this.state.schema.length > 0 &&
                  <div>
                    <DataTable plain>
                      <TableHeader>
                        <TableRow>
                          <TableColumn>Name</TableColumn>
                          <TableColumn>Default Value</TableColumn>
                          <TableColumn>Private</TableColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows}
                      </TableBody>
                    </DataTable>
                  </div>}
              </Row>
            </div>
          </Col>
        </Row>
      </form>
    );
  }
}
