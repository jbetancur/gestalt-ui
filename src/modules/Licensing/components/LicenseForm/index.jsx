import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { FormattedDate } from 'react-intl';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import Label from 'components/Label';
import P from 'components/P';
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
              <P><FormattedDate value={licenseInfo[detailItem]} /></P>
            </div>
          );
        }

        return (
          <div key={detailItem}>
            <Label>{detailItem}</Label>
            <P>{licenseInfo[detailItem]}</P>
          </div>
        );
      }

      return null;
    })
  );

  return (
    <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="flex-row">
        <div className="flex-row flex-5 flex-xs-12">
          <Field
            className="flex-12"
            component={TextField}
            name="properties.data"
            label="License Key"
            type="text"
            rows={4}
            required
          />
        </div>
        {licenseInfo.consumerType &&
        <div className="flex-row flex-7 flex-xs-12">
          <div className="flex-6 flex-xs-12">
            {generateDetailItems()}
          </div>
          <div className="flex-6 flex-xs-12">
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
          </div>
        </div>}
      </div>
      <ModalFooter>
        <Button
          flat
          label="Cancel"
          disabled={submitting}
          onClick={() => close()}
        />
        <Button
          raised
          label={submitLabel}
          type="submit"
          disabled={pristine || invalid || submitting}
          primary
        />
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
  cancelLabel: 'Cancel'
};

export default LicenseForm;
