import React from 'react';
import CheckboxGroup from './CheckboxGroup';

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

export default {
  component: CheckboxGroup,
  title: 'CheckboxGroup',
};

export const normal = () => <CheckboxGroup items={items} />;
