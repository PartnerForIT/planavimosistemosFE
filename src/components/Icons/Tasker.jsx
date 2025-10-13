/* eslint-disable max-len */
import React from 'react';

export default (props) => {
  const { className = '', ...restProps } = props;
  
  return (
    <div 
      className={className}
      {...restProps}
    />
  );
};
