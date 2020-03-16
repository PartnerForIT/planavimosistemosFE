import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import Input from './Input';

export default {
  component: Input,
  title: 'Input',
};

const SearchIcon = () => (
  <SvgIcon width='14.741' height='14.593' viewBox='0 0 14.741 14.593'>
    <g id='Group_2293' data-name='Group 2293' transform='translate(0.707)'>
      <line
        id='Line_182'
        data-name='Line 182'
        y1='4.01'
        x2='4.01'
        transform='translate(0 9.875)'
        fill='none'
        stroke='#cbd1d8'
        strokeWidth='2'
      />
      <g id='Ellipse_5' data-name='Ellipse 5' transform='translate(2.034)' fill='none' stroke='#cbd1d8' strokeWidth='2'>
        <circle cx='6' cy='6' r='6' stroke='none' />
        <circle cx='6' cy='6' r='5' fill='none' />
      </g>
    </g>
  </SvgIcon>
);

export const normal = () => <Input icon={<SearchIcon />} />;

export const withoutIcon = () => <Input placeholder='Input without icon' />;
