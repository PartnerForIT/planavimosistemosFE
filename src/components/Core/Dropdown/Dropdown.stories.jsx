import React, { useCallback, useState } from 'react';
import { storiesOf } from '@storybook/react';

// import { action } from '@storybook/addon-actions';

import Dropdown from './Dropdown';
// import '../../App/App.module.scss';

const stories = storiesOf('Dropdown', module);

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
];

const Drp = () => {
  const [itemsArray, setItemsArray] = useState(items);

  const handleCheckboxChange = useCallback((itemId) => {
    const setCheckedToAll = (array, value) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };
        if (o.id === itemId) {
          if (!newObj.disabled) newObj.checked = value || !o.checked;
          if (newObj.items) {
            newObj.items = setCheckedToAll(o.items, !o.checked);
          }
        } else if (o.items) {
          if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
          newObj.items = setCheckedToAll(o.items, value);
        } else if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
        return newObj;
      });
    };
    setItemsArray(setCheckedToAll);
  }, []);

  return (
    <div>
      {
        itemsArray.map((item, idx) => (item.type && item.type === 'group'
          ? (
            <Dropdown
              key={idx.toString()}
              label={item.label}
              id={item.id}
              checked={item.checked}
              items={item.items}
              onChange={handleCheckboxChange}
            />
          ) : null))
      }
    </div>
  );
};

stories.add('normal', () => <Drp />);
