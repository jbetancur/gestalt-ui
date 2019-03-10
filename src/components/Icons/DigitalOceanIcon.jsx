import React from 'react';
import PropTypes from 'prop-types';
import SVGIcon from '@material-ui/core/SvgIcon';

/* eslint react/jsx-indent: 0 */
const DigitalOceanLogo = ({ size, ...rest }) => (
  <SVGIcon viewBox="65.2 173.5 180 180" style={{ fontSize: `${size}px` }} {...rest}>
    <g id="XMLID_229_">
      <g id="XMLID_690_">
        <g id="XMLID_691_">
          <g>
            <g id="XMLID_44_">
              <g id="XMLID_48_">
                <path id="XMLID_49_" fill="#0080FF" d="M155.2,351.7v-34.2c36.2,0,64.3-35.9,50.4-74c-5.1-14.1-16.4-25.4-30.5-30.5c-38.1-13.8-74,14.2-74,50.4l0,0H67c0-57.7,55.8-102.7,116.3-83.8c26.4,8.3,47.5,29.3,55.7,55.7C257.9,295.9,213,351.7,155.2,351.7z" />
              </g>
              <polygon id="XMLID_47_" fill="#0080FF" points="155.3,317.6 121.3,317.6 121.3,283.6 121.3,283.6 155.3,283.6 155.3,283.6" />
              <polygon id="XMLID_46_" fill="#0080FF" points="121.3,343.8 95.1,343.8 95.1,343.8 95.1,317.6 121.3,317.6" />
              <path id="XMLID_45_" fill="#0080FF" d="M95.1,317.6H73.2l0,0v-21.9l0,0h21.9l0,0V317.6z" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </SVGIcon>
);

DigitalOceanLogo.propTypes = {
  size: PropTypes.number
};

DigitalOceanLogo.defaultProps = {
  size: 22,
};

export default DigitalOceanLogo;
