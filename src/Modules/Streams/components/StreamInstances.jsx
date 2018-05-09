import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { withProviderActions } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle, CardContent } from 'components/Cards';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { Title } from 'components/Typography';
import { FontIcon } from 'react-md';
import { orderBy } from 'lodash';
import { ActionsMenu } from 'Modules/Actions';

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
                instance
                actionList={providerActions.providerActions}
                pending={providerActions.providerActionsLoading}
                keyField="persistenceId"
                fqon={fqon}
              />
            </CardActions>

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
  fqon: PropTypes.string.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.object.isRequired,
};

export default compose(
  withProviderActions({ filter: 'streamspec.instances' }),
)(StreamInstances);
