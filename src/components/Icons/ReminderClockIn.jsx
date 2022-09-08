import React from 'react';
import LogoClockIn from '../../assets/reminder_clock_in.png';

export default ({ src = LogoClockIn, ...props }) => {
  return (
    <>
      <img
        src={src}
        loading='lazy'
        width='54px'
        height='54px'
        {...props}
      />
    </>
  );
};
