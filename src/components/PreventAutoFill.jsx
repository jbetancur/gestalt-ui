/**
 * Place hack component between elements to override chrome autofill for usernames/passwords
 */
import React from 'react';

const style = {
  height: 0,
  width: 0,
  position: 'absolute',
  outline: 'none',
  border: 'none',
  left: '-9999999999em',
};

export default () => <input style={style} type="text" />;
