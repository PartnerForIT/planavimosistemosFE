import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

const PendingIcon = ({ className }) => (
  /* eslint max-len: ["error", { "ignoreStrings": true }] */
  <SvgIcon viewBox='0 0 16 16' className={className}>
    <defs>
      <clipPath id='clip-path'>
        <rect id='Rectangle_70936' data-name='Rectangle 70936' width='13.568' height='13.568' fill='#ffac00' />
      </clipPath>
    </defs>
    <g id='Group_2216' data-name='Group 2216' transform='translate(-47 -422)'>
      <g id='Group_1639' data-name='Group 1639' transform='translate(0 60)'>
        <g
          id='Ellipse_30'
          data-name='Ellipse 30'
          transform='translate(47 362)'
          fill='#fff'
          stroke='#fafbfc'
          strokeWidth='1'
        >
          <circle cx='8' cy='8' r='8' stroke='none' />
          <circle cx='8' cy='8' r='7.5' fill='none' />
        </g>
      </g>
      <g id='Group_1648' data-name='Group 1648' transform='translate(48.192 423.192)'>
        <g id='Group_1643' data-name='Group 1643' transform='translate(0 0)' clipPath='url(#clip-path)'>
          <path
            id='Subtraction_1'
            data-name='Subtraction 1'
            d='M6.786,13.57A6.767,6.767,0,0,1,2,2a6.711,6.711,0,0,1,9.565,0A6.782,6.782,0,0,1,6.786,13.57ZM3.3,6.58a.462.462,0,0,0,0,.924H6.779a.46.46,0,0,0,.465-.465V2.9a.458.458,0,0,0-.465-.46.45.45,0,0,0-.46.46V6.58Z'
            transform='translate(-0.001 -0.002)'
            fill='#ffac00'
            stroke='rgba(0,0,0,0)'
            strokeMiterlimit='10'
            strokeWidth='1'
          />
        </g>
      </g>
    </g>
  </SvgIcon>
);

export default PendingIcon;
