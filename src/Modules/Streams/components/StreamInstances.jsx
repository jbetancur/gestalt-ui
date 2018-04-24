import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle } from 'components/Cards';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { orderBy } from 'lodash';

const StreamInstances = ({ streamSpec }) => (
  <Row gutter={5}>
    {orderBy(streamSpec.properties.streams, 'startTime', 'asc').map(stream => (
      <Col flex={4} xs={12} sm={12} md={6}>
        <Card>
          <CardTitle
            title={stream.status}
            subTitle={
              <React.Fragment>
                <FormattedRelative value={stream.startTime} /> @ <FormattedTime value={stream.startTime} />
              </React.Fragment>
            }
          />
        </Card>
      </Col>
    ))}
  </Row>
);

StreamInstances.propTypes = {
  streamSpec: PropTypes.object.isRequired,
};

export default StreamInstances;
