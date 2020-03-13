import React from 'react';
// import { action } from '@storybook/addon-actions';

import CustomSelect from './Select';

const items = [
  {
    id: 0,
    type: 'group',
    label: 'Group A',
    items: [
      {
        id: 1,
        label: 'Employee Name',
        checked: false,
      },
      {
        id: 2,
        label: 'Employee Name 2',
        checked: true,
      },
    ],
  },
  {
    id: 3,
    type: 'group',
    label: 'Group B',
    checked: true,
    items: [
      {
        id: 4,
        label: 'Employee Name 3',
        checked: false,
      },
      {
        id: 5,
        label: 'Employee Name 4',
        checked: true,
      },
      {
        id: 6,
        label: 'Employee Name 5',
        checked: true,
        disabled: true,
      },
    ],
  },
  {
    id: 7,
    type: 'group',
    label: 'Group C',
    checked: false,
    items: [
      {
        id: 8,
        type: 'group',
        label: 'Group C.1',
        checked: false,
        items: [
          {
            id: 9,
            label: 'Employee Name',
            checked: false,
          },
          {
            id: 10,
            label: 'Employee Name 2',
            checked: true,
          },
          {
            id: 11,
            label: 'Employee Name 3',
            checked: false,
            disabled: true,
          },
        ],
      },
      {
        id: 12,
        type: 'group',
        label: 'Group C.2',
        checked: false,
        items: [
          {
            id: 13,
            label: 'Employee Name C.2',
            checked: false,
          },
          {
            id: 14,
            label: 'Employee Name 2  C.2',
            checked: true,
          },
          {
            id: 15,
            label: 'Employee Name 3  C.2',
            checked: true,
            disabled: true,
          },
          {
            id: 16,
            label: 'Employee Name 4  C.2',
            checked: false,
            disabled: true,
          },
        ],
      },
    ],
  },
];

export default {
  component: CustomSelect,
  title: 'Select',
};

export const normal = () => (<CustomSelect items={items} />);
