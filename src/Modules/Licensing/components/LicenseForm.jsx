import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'redux-form';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { FormattedDate } from 'react-intl';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import Label from 'components/Label';
import { H4 } from 'components/Typography';
import { ModalFooter } from 'components/Modal';

const LicenseForm = (props) => {
  const {
    submitLabel,
    submitting,
    pristine,
    invalid,
    handleSubmit,
    onSubmit,
    licenseInfo,
  } = props;

  const close = () => {
    props.reset();
    props.hideLicenseModal();
  };

  const generateDetailItems = () => (
    Object.keys(licenseInfo).map((detailItem) => {
      if (detailItem !== 'features') {
        if (detailItem === 'issued' || detailItem === 'notBefore' || detailItem === 'notAfter') {
          return (
            <div key={detailItem}>
              <Label>{detailItem}</Label>
              <H4><FormattedDate value={licenseInfo[detailItem]} /></H4>
            </div>
          );
        }

        return (
          <div key={detailItem}>
            <Label>{detailItem}</Label>
            <H4>{licenseInfo[detailItem]}</H4>
          </div>
        );
      }

      return null;
    })
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Row gutter={5}>
        <Col flex={5} xs={12}>
          <Field
            component={TextField}
            name="properties.data"
            label="License Key"
            type="text"
            rows={4}
            required
          />
        </Col>
        {licenseInfo.consumerType &&
        <Col flex={7} xs={12}>
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              {generateDetailItems()}
            </Col>
            <Col flex={6} xs={12}>
              {Object.keys(licenseInfo.features).map(feature => (
                <Checkbox
                  id={feature}
                  name={feature}
                  key={feature}
                  label={feature}
                  defaultChecked={licenseInfo.features[feature]}
                  disabled
                />
              ))}
            </Col>
          </Row>
        </Col>}
      </Row>
      <ModalFooter>
        <Button
          flat
          disabled={submitting}
          onClick={() => close()}
        >
          Cancel
        </Button>
        <Button
          raised
          type="submit"
          disabled={pristine || invalid || submitting}
          primary
        >
          {submitLabel}
        </Button>
      </ModalFooter>
    </form>
  );
};

LicenseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string,
  hideLicenseModal: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  licenseInfo: PropTypes.object.isRequired,
};

LicenseForm.defaultProps = {
  submitLabel: '',
};

export default LicenseForm;
