import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import Label from 'components/Label';
import { Caption, H5 } from 'components/Typography';
import { StatusBubble } from 'components/Status';
import { ClipboardButton } from 'components/Buttons';
import Divider from 'components/Divider';
import { getLastFromSplit } from 'util/helpers/strings';

const CopyUUIDButton = styled.div`
  button {
    margin-left: 6px;
    height: 16px;
    width: 15px;
    padding: 1px;
    border-radius: none;

    i {
      font-size: 16px !important;
    }
  }
`;

const Content = styled.div`
  text-align: left;
  padding: 0 8px 0 8px;
`;

const StatusStyle = styled.div`
  display: inline-block;
`;

const DetailPane = ({ model, singleRow }) => {
  const owner = get(model, 'owner.name') || get(model, 'owner.id');
  const createdStamp = get(model, 'created.timestamp');
  const modifiedStamp = get(model, 'modified.timestamp');
  const hasProvider = get(model, 'properties.provider.id') && get(model, 'properties.provider.name');
  const flex = singleRow ? 2 : 4;

  if (!model.id) {
    return null;
  }

  return (
    <Content>
      <Row gutter={5}>
        <Col flex={flex} xs={6}>
          <StatusStyle>
            <Label>Resource State</Label>
            <StatusBubble status={getLastFromSplit(model.resource_state)} />
          </StatusStyle>
        </Col>

        <Col flex={flex} xs={6}>
          <Label>Resource Type</Label>
          <H5>{model.resource_type}</H5>
        </Col>

        <Col flex={flex} xs={6}>
          <CopyUUIDButton>
            <Label>UUID</Label>
            <ClipboardButton
              showLabel={false}
              text={model.id}
              tooltipLabel="Copy uuid to clipboard"
            />
            <H5>{model.id}</H5>
          </CopyUUIDButton>
        </Col>

        <Col flex={flex} xs={6}>
          <Label>Owner</Label>
          <H5>{owner}</H5>
        </Col>

        <Col flex={flex} xs={6}>
          <Label>Created</Label>
          {createdStamp &&
            <H5>
              <div>
                <div>
                  <FormattedRelative value={createdStamp} />
                </div>
                <Caption>
                  <FormattedDate value={createdStamp} /> <FormattedTime value={createdStamp} />
                </Caption>
              </div>
            </H5>}
        </Col>

        <Col flex={flex} xs={6}>
          <Label>Modified</Label>
          {modifiedStamp &&
            <H5>
              <div>
                <FormattedRelative value={modifiedStamp} />
              </div>
              <Caption>
                <FormattedDate value={modifiedStamp} /> <FormattedTime value={modifiedStamp} />
              </Caption>
            </H5>}
        </Col>

        {hasProvider &&
          <Row gutter={5}>
            <Col flex={12}>
              <Label>Provider Details</Label>
              <Divider />
            </Col>
            <Col flex={flex} xs={6}>
              <Label>Name</Label>
              <H5>{model.properties.provider.name}</H5>
            </Col>

            <Col flex={flex} xs={6}>
              <Label>Resouce Type</Label>
              <H5>{model.properties.provider.resource_type}</H5>
            </Col>

            <Col flex={flex} xs={6}>
              <Label>Description</Label>
              <H5>{model.properties.provider.description}</H5>
            </Col>
          </Row>}
      </Row>
    </Content>
  );
};

DetailPane.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  singleRow: PropTypes.bool,
};

DetailPane.defaultProps = {
  model: {
    modified: {},
    created: {},
    properties: {},
  },
  singleRow: false,
};

export default DetailPane;
