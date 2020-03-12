import React from 'react';
// import { action } from '@storybook/addon-actions';

// import classNames from 'classnames';
import StyledCheckbox from '../Checkbox/Checkbox';
import Dropdown from '../Dropdown/Dropdown';
import CheckboxGroup from '../CheckboxGroupRaw/CheckboxGroupRaw';
// import styles from '../CheckboxGroupRaw/CheckboxGroupRaw.module.scss';
// import '../../App/App.module.scss';

const items = [
  {
    type: 'group',
    label: 'Group A',
    items: [
      {
        label: 'Employee Name',
        checked: false,
      },
      {
        label: 'Employee Name 2',
        checked: true,
      },
    ],
  },
  {
    type: 'group',
    label: 'Group B',
    checked: true,
    items: [
      {
        label: 'Employee Name 3',
        checked: false,
      },
      {
        label: 'Employee Name 4',
        checked: true,
      },
      {
        label: 'Employee Name 5',
        checked: true,
        disabled: true,
      },
      {
        label: 'Employee Name 6',
        checked: false,
        disabled: true,
      },
    ],
  },
  {
    type: 'group',
    label: 'Group C',
    items: [
      {
        type: 'group',
        label: 'Group C.1',
        items: [
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
        ],
      },
      {
        type: 'group',
        label: 'Group C.2',
        items: [
          {
            label: 'Employee Name C.2',
            checked: false,
          },
          {
            label: 'Employee Name 2  C.2',
            checked: true,
          },
          {
            label: 'Employee Name 3  C.2',
            checked: true,
            disabled: true,
          },
          {
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
  component: StyledCheckbox,
  title: 'Select',
};

export const normal = () => (
  <div>
    {
    items.map((item, idx) => (item.type && item.type === 'group'
      ? <Dropdown key={idx.toString()} label={item.label} items={item.items} />
      : <CheckboxGroup key={idx.toString()} items={item.items} onChange={console.log} />))
  }
  </div>
);
