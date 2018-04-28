import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-flexybox';
import { Checkbox } from 'components/ReduxFormFields';

export default class APIEndpointSecurity extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isToggled: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    isToggled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  render() {
    const { isToggled } = this.props;

    return (
      <Row gutter={5} className={this.props.className}>
        <Col flex={12} xs={12}>
          <Field
            id="show-api-endpoints-security"
            component={Checkbox}
            name="properties.plugins.gestaltSecurity.enabled"
            defaultChecked={isToggled}
            label="Require Authentication"
            style={{ marginTop: 0 }}
          />
        </Col>
      </Row>
    );
  }
}
