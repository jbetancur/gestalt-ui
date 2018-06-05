import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { compose } from 'redux';
import { withProviderActions } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import { Card, CardTitle } from 'components/Cards';
import { FormattedRelative, FormattedTime } from 'react-intl';
import { Title } from 'components/Typography';
import { Button } from 'components/Buttons';
import { orderBy } from 'lodash';
import { ActionsMenu } from 'Modules/Actions';
import actions from '../actions';

const TitleContent = styled(Col)`
  padding: 24px;
  text-align: center;
`;

const CardActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
`;

const CardFooter = styled.div`
  padding: 4px;
`;

const StreamInstances = ({ fqon, streamSpec, streamInstances, providerActions, onActionComplete, showModal }) => (
  <Row gutter={5}>
    {streamInstances.length > 0 ?
      orderBy(streamInstances, ['startTime'], 'desc').map(stream => (
        <Col flex={4} xs={12} sm={12} key={stream.persistenceId}>
          <Card>
            <CardTitle
              title={stream.status}
              subTitle={
                <React.Fragment>
                  <div>started: <FormattedRelative value={stream.startTime} /> @<FormattedTime value={stream.startTime} /></div>
                  retries: {stream.retries}
                </React.Fragment>
              }
            />

            <CardActions>
              <ActionsMenu
                icon
                onActionComplete={onActionComplete}
                model={stream}
                actionList={providerActions.providerActions}
                pending={providerActions.providerActionsLoading}
                isChildResource
                keyField="persistenceId"
                parentKeyField="definitionId"
                fqon={fqon}
              />
            </CardActions>

            <CardFooter>
              <Button
                flat
                primary
                onClick={() => showModal({ fqon, streamId: streamSpec.id, persistenceId: stream.persistenceId })}
                disabled={stream.status === 'stopped'}
              >
                View Stream
              </Button>
            </CardFooter>
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
  streamSpec: PropTypes.object.isRequired,
  streamInstances: PropTypes.array.isRequired,
  providerActions: PropTypes.object.isRequired,
  onActionComplete: PropTypes.func,
  showModal: PropTypes.func.isRequired,
};

StreamInstances.defaultProps = {
  onActionComplete: () => {},
};

export default compose(
  withProviderActions({ filter: 'streamspec.instances' }),
  connect(null, actions)
)(StreamInstances);
