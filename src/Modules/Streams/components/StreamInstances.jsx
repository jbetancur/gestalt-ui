import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { withProviderActions } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle } from 'components/Cards';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { Title } from 'components/Typography';
import { orderBy } from 'lodash';
import { ActionsMenu } from 'Modules/Actions';
import { Line } from 'react-chartjs-2';

const generateSampleData = () => ({
  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  datasets: [
    {
      label: 'Throughput',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)),
    }
  ]
});

const TitleContent = styled(Col) `
  padding: 24px;
  text-align: center;
`;

const CardActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
`;

const StreamInstances = ({ fqon, streamInstances, providerActions }) => (
  <Row gutter={5}>
    {streamInstances.length > 0 ?
      orderBy(streamInstances, ['startTime'], 'desc').map(stream => (
        <Col flex={4} xs={12} sm={12} key={stream.persistenceId}>
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

            <CardActions>
              <ActionsMenu
                icon
                model={stream}
                actionList={providerActions.providerActions}
                pending={providerActions.providerActionsLoading}
                isInstance
                keyField="persistenceId"
                parentKeyField="definitionId"
                fqon={fqon}
              />
            </CardActions>

            <Line data={generateSampleData()} />
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
  fqon: PropTypes.string.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.object.isRequired,
};

export default compose(
  withProviderActions({ filter: 'streamspec.instances' }),
)(StreamInstances);
