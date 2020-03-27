import React, { useCallback, useState } from 'react';
import { storiesOf } from '@storybook/react';
import DataTable from './DTM';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import PendingIcon from '../../Icons/PendingIcon';

const data = [
  {
    label: 'Tuesday, 17, March, 2020',
    titleColor: '#F59F13',
    backgroundColor: 'rgba(250, 172, 46, 0.1)',
    items: [
      {
        id: 1,
        status: 'Pending',
        employee: 'Mehmet Baran',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        id: 2,
        status: 'Approved',
        employee: 'Zerya Loren',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Developer',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        id: 3,
        status: 'Pending',
        employee: 'Brad Betül',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        data: {
          columns: [
            { title: 'Work Date', field: 'work_date' },
            { title: 'Start', field: 'start' },
            { title: 'End', field: 'end' },
            { title: 'Comment', field: 'comment' },
            { title: 'Duration', field: 'duration' },
          ],
          items: [
            {
              work_date: '2019-09-19',
              start: '07:00',
              end: '14:00',
              comment: 'A lot of customers, good day',
              duration: '07:00',
            },
            {
              work_date: '2019-09-20',
              start: '10:00',
              end: '18:00',
              comment: 'A lot of drunk people',
              duration: '08:00',
            },
            {
              work_date: '2019-09-21',
              start: '09:30',
              end: '15:00',
              comment: 'No customers for today',
              duration: '06:30',
            },
          ],
        },
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        id: 4,
        status: 'Pending',
        employee: 'Steve Smith',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        id: 5,
        status: 'Suspended',
        employee: 'Sus Baran',
        group: 'Group B',
        subgroup: 'Sub Group B',
        skill: 'Barmen',
        data: {
          columns: [
            { title: 'Work Date', field: 'work_date' },
            { title: 'Start', field: 'start' },
            { title: 'End', field: 'end' },
            { title: 'Comment', field: 'comment' },
            { title: 'Duration', field: 'duration' },
          ],
          items: [
            {
              work_date: '2019-09-19',
              start: '07:00',
              end: '14:00',
              comment: 'A lot of customers, good day',
              duration: '07:00',
            },
            {
              work_date: '2019-09-20',
              start: '10:00',
              end: '18:00',
              comment: 'A lot of drunk people',
              duration: '08:00',
            },
            {
              work_date: '2019-09-21',
              start: '09:30',
              end: '15:00',
              comment: 'No customers for today',
              duration: '06:30',
            },
          ],
        },
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
    ],
  },
  {
    label: 'Wednesday, 18, March, 2020',
    items: [
      {
        id: 6,
        status: 'Pending',
        employee: 'Tara Betul',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-18 11:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        id: 7,
        status: 'Approved',
        employee: 'Zerya Loren',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Tailor',
        finishedAt: '2020-03-18 19:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        id: 8,
        status: 'Suspended',
        employee: 'Brad Jonson',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'None',
        finishedAt: '2020-03-18 22:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        id: 9,
        status: 'Pending',
        employee: 'Steve Kopernik',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'None',
        finishedAt: '2020-03-18 21:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        id: 10,
        status: 'Pending',
        employee: 'Zerya Betül',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Taxi',
        finishedAt: '2020-03-18 16:13:32',
        finishedAtFormatted: '2020-03-18',
      },
    ],
  },
];

const columns = [
  { label: 'Status', field: 'status', checked: true },
  { label: 'Employee', field: 'employee', checked: true },
  { label: 'Group', field: 'group', checked: true },
  { label: 'Sub-Group', field: 'subgroup', checked: true },
  { label: 'Skill', field: 'skill', checked: true },
];

const icons = {
  status: [
    {
      value: 'Approved',
      icon: <ApprovedIcon />,
    },
    {
      value: 'Suspended',
      icon: <SuspendedIcon />,
    },
    {
      value: 'Pending',
      icon: <PendingIcon />,
    },
  ],
};

const DataTableContainer = () => {
  const [itemsArray, setItemsArray] = useState(data);
  const [columnsArray, setColumnsArray] = useState(columns);

  const selectionHandler = useCallback((itemId, value) => {
    const setCheckedToAll = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((group) => {
        const items = group.items.map((row) => {
          const newRowObj = { ...row };
          if (typeof itemId === 'string' && itemId === 'all') {
            newRowObj.checked = value;
          } else if (Array.isArray(itemId) && itemId.includes(newRowObj.id)) {
            newRowObj.checked = value;
          } else if (newRowObj.id === itemId) {
            newRowObj.checked = value;
          }
          return newRowObj;
        });
        return { ...group, items };
      });
    };
    setItemsArray(setCheckedToAll);
  }, []);

  const sortHandler = useCallback((field, asc) => {
    const sortItems = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((group) => {
        const items = [...group.items];
        if (asc) {
          items.sort((a, b) => a[field].localeCompare(b[field]));
        } else {
          items.sort((a, b) => b[field].localeCompare(a[field]));
        }
        return { ...group, items };
      });
    };
    setItemsArray(sortItems);
  }, []);

  return (
    <DataTable
      data={itemsArray}
      columns={columnsArray}
      onColumnsChange={setColumnsArray}
      selectable
      sortable
      onSelect={selectionHandler}
      onSort={sortHandler}
      fieldIcons={icons}
    />
  );
};

const stories = storiesOf('DataTableCustom', module);

stories.add('normal', () => <DataTableContainer />);
