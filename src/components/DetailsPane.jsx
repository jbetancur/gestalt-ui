import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import Label from 'components/Label';
import { H4 } from 'components/Typography';
import StatusBubble from 'components/StatusBubble';
import { ClipboardButton } from 'components/Buttons';
import { getLastFromSplit } from 'util/helpers/strings';

const ContainsButtonsStyle = styled.div`
  button {
    margin-left: 6px;
    height: 22px;
    width: 22px;
    padding: 1px;
    border-radius: none;

    i {
      font-size: 18px;
    }
  }
`;

const Content = styled.div`
  text-align: left;
`;

const StatusStyle = styled.div`
  display: inline-block;
`;

const DetailPane = (props) => {
  const { model } = props;

  return (
    model.id ?
      <Content>
        <Row gutter={6}>
          <Col flex={4} xs={12} sm={6} md={6}>
            <ContainsButtonsStyle>
              <Label>UUID</Label>
              <ClipboardButton
                showLabel={false}
                text={model.id}
                tooltipLabel="Copy uuid to clipboard"
              />
              <H4>{model.id}</H4>
            </ContainsButtonsStyle>
            <div>
              <Label>Owner</Label>
              <H4>{model.owner && model.owner.name}</H4>
            </div>
          </Col>

          <Col flex={4} xs={12} sm={6} md={6}>
            <div>
              <Label>Created</Label>
              {model.created.timestamp &&
                <H4>
                  <FormattedRelative value={model.created.timestamp} /> (<FormattedDate value={model.created.timestamp} /> <FormattedTime value={model.created.timestamp} />)
                </H4>}
            </div>
            <div>
              <Label>Modified</Label>
              {model.modified.timestamp &&
                <H4>
                  <FormattedRelative value={model.modified.timestamp} /> (<FormattedDate value={model.modified.timestamp} /> <FormattedTime value={model.modified.timestamp} />)
                </H4>}
            </div>
          </Col>

          <Col flex={4} xs={12} sm={6} md={6}>
            <div>
              <Label>Resource Type</Label>
              <H4>{model.resource_type}</H4>
            </div>
            <StatusStyle>
              <Label>Resource State</Label>
              <StatusBubble status={getLastFromSplit(model.resource_state)} />
            </StatusStyle>
          </Col>
        </Row>
      </Content> : null
  );
};

DetailPane.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

DetailPane.defaultProps = {
  model: {},
};

export default DetailPane;
