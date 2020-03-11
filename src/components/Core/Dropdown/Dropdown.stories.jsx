import React from 'react';
// import { action } from '@storybook/addon-actions';

import Dropdown from './Dropdown';
// import '../../App/App.module.scss';

export default {
  component: Dropdown,
  title: 'Dropdown',
};

const items = [
  {
    label: 'Employee Name',
    checked: false,
  },
  {
    label: 'Employee Name 2',
    checked: true,
  },
  {
    label: 'Employee Name 3',
    checked: true,
    disabled: true,
  },
  {
    label: 'Employee Name 4',
    checked: false,
    disabled: true,
  },
];

export const normal = () => <Dropdown label='Group A' items={items} />;
