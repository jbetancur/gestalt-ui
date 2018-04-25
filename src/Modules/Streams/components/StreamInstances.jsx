import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardContent } from 'components/Cards';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { Title } from 'components/Typography';
import { FontIcon } from 'react-md';
import { orderBy } from 'lodash';

const TitleContent = styled(Col) `
  padding: 24px;
  text-align: center;
`;

const StreamInstances = ({ streamSpec }) => (
  <Row gutter={5}>
    {streamSpec.properties.streams.length > 0 ?
      orderBy(streamSpec.properties.streams, ['startTime'], 'asc').map(stream => (
        <Col flex={4} xs={12} sm={12}>
          <Card>
            <CardTitle
              title={stream.status}
              subTitle={
                <React.Fragment>
                  <div>Started: <FormattedRelative value={stream.startTime} /> @<FormattedTime value={stream.startTime} /></div>
                  Retries: {stream.retries}
                </React.Fragment>
              }
            />

            <CardContent style={{ textAlign: 'center', borderTop: '1px dotted #757575', background: '#eceff1' }}>
              <FontIcon style={{ fontSize: '50px', color: '#bdbdbd' }}>insert_chart</FontIcon>
            </CardContent>
          </Card>
        </Col>
      )) :
      <Col flex={12}>
        <Row center fill>
          <TitleContent flex={12}>
            <Title light>No streams have been started</Title>
          </TitleContent>
        </Row>
      </Col>
    }
  </Row>
);

StreamInstances.propTypes = {
  streamSpec: PropTypes.object.isRequired,
};

export default StreamInstances;
