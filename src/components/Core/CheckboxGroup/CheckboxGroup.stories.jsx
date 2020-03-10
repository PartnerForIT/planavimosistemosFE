import React from 'react';
import CheckboxGroup from './CheckboxGroup';

const items = [
  {
    label: 'Item 1',
  },
  {
    label: 'Item 2',
    checked: true,
  },
  {
    label: 'Item 3',
    checked: true,
    disabled: true,
  },
  {
    label: 'Item 4',
    checked: false,
    disabled: true,
  },
];

export default {
  component: CheckboxGroup,
  title: 'CheckboxGroup',
};

export const normal = () => <CheckboxGroup items={items} />;
