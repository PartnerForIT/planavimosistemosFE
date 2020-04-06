import React, { useCallback, useState } from 'react';
// import { action } from '@storybook/addon-actions';

import { storiesOf } from '@storybook/react';
import CustomSelect from './Select';

const stories = storiesOf('CustomSelect', module);

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

const flatItems = [
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
];

const Container = ({ ...props }) => {
  const [itemsArray, setItemsArray] = useState(flatItems);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = useCallback((item) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array, value) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };
        if (o.id === item.id) {
          if (!newObj.disabled) newObj.checked = value || !o.checked;
          if (newObj.items) {
            newObj.items = setCheckedToAll(o.items, !o.checked);
          }
        } else if (o.items) {
          if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
          newObj.items = setCheckedToAll(o.items, value);
        } else if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);

        return newObj;
      });
    };
    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
    // setItemsStat({
    //   ...itemsStat,
    //   checked: checkedItemsArray.length,
    //   unchecked: itemsStat.total - checkedItemsArray.length,
    // });
  }, [setItemsArray]);

  const selectAll = useCallback((check) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };

        if (!newObj.disabled) newObj.checked = check;
        if (newObj.items) {
          newObj.items = setCheckedToAll(o.items);
        }

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);
        // if (check) {
        //   setItemsStat({ ...itemsStat, checked: itemsStat.total, unchecked: 0 });
        // } else {
        //   setItemsStat({ ...itemsStat, checked: 0, unchecked: itemsStat.total });
        // }

        return newObj;
      });
    };

    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
  }, []);

  return (
    <div style={{ width: '300px' }}>
      <CustomSelect
        handleCheckboxChange={handleCheckboxChange}
        selectAll={selectAll}
        checkedItems={checkedItems}
        items={itemsArray}
        {...props}
      />
    </div>
  );
};

stories.add('normal', () => (<Container placeholder='All employees' buttonLabel='Filter' />));
stories.add('withGroups', () => (<Container placeholder='All employees' buttonLabel='Filter' items={items} />));
