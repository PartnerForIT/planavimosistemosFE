import React from 'react';
import LogoClockOut from '../../assets/reminder_clock_out.png';

export default ({ src = LogoClockOut, ...props }) => {
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
