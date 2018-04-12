import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexybox';
import { withStream, withPickerData } from 'Modules/MetaResource';
import { Form } from 'react-final-form';
import StreamForm from './StreamForm';

const initialValues = {
  name: null,
  properties: {
    cpus: 1,
    mem: 512,
    parallelization: 1,
    processor: {
      type: 'map',
      lambda_id: null,
      input_stream_config: {
        name: null,
        feed_id: null,
        partition: {
          partition: 0,
          startOffset: -1,
          endOffset: -1
        },
      },
      output_stream_config: {
        name: null,
        feedID: null,
      }
    },
  },
};

class StreamCreate extends Component {
  static propTypes = {
    // match: PropTypes.object.isRequired,
    lambdasData: PropTypes.array.isRequired,
    datafeedsData: PropTypes.array.isRequired,
  };
  onSubmit = (values) => {
    // eslint-disable-next-line no-alert
    window.alert(JSON.stringify(values, 0, 2));
  };

  render() {
    const { lambdasData, datafeedsData } = this.props;

    return (
      <Row center>
        <Col flex={8}>
          <Form
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            render={StreamForm}
            lambdas={lambdasData}
            datafeeds={datafeedsData}
          />
        </Col>
      </Row>
    );
  }
}

/* eslint-disable-next-line */
const mapStateToProps = state => ({
  // stream: selectStream(state),
});

export default compose(
  withPickerData({ entity: 'providers', label: 'Providers', params: { type: 'CaaS' } }),
  withPickerData({ entity: 'datafeeds', label: 'Data Feeds' }),
  withPickerData({ entity: 'lambdas', label: 'Lambdas' }),
  withStream,
  connect(mapStateToProps),
)(StreamCreate);
