import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useDispatch, useSelector } from 'react-redux';
import styles from './Logbook.module.scss';
import DRP from '../Core/DRP/DRP';
import SearchIcon from '../Icons/SearchIcon';
import Input from '../Core/Input/Input';
import CustomSelect from '../Core/Select/Select';
import Button from '../Core/Button/Button';
import DataTable from '../Core/DataTableCustom/DTM';
import ApprovedIcon from '../Icons/ApprovedIcon';
import SuspendedIcon from '../Icons/SuspendedIcon';
import PendingIcon from '../Icons/PendingIcon';
import TableIcon from '../Icons/TableIcon';
// import { userSelector } from '../../store/auth/selectors';
// import { authCheck } from "../../store/auth/actions";

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
  { title: 'Status', field: 'status' },
  { title: 'Employee', field: 'employee' },
  { title: 'Group', field: 'group' },
  { title: 'Sub-Group', field: 'subgroup' },
  { title: 'Skill', field: 'skill' },
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

const Logbook = () => {
  const [itemsArray, setItemsArray] = useState(data);

  const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const user = useSelector(userSelector);

  useEffect(() => {
    // dispatch(authCheck()).then().catch()
    // do not add dispatch to the deps
  }, []);

  const applyHandler = (e) => {
    console.log('applyHandler', e);
  };

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

  const Delimiter = () => (<div className={styles.delimiter} />);

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <header className={styles.appHeader}>
          <DRP />
          <Delimiter />
          <Input icon={<SearchIcon />} placeholder={`${t('Search')}...`} width='186px' height='36px' />
          <Delimiter />
          <CustomSelect placeholder={t('All groups')} buttonLabel={t('Filter')} items={items} />
          <Delimiter />
          <CustomSelect placeholder={t('All employees')} buttonLabel={t('Filter')} items={items} />
          <Delimiter />
          <Button onClick={applyHandler}>{t('Apply')}</Button>
        </header>
        <Delimiter />
        <DataTable
          data={itemsArray}
          columns={columns}
          selectable
          sortable
          onSelect={selectionHandler}
          onSort={sortHandler}
          fieldIcons={icons}
        />
      </div>
      <div className={styles.rightSidebar}>
        <div className={styles.emptyWrapper}>
          <TableIcon />
          <p>Select any entry to get a detailed editable info</p>
        </div>
      </div>
    </div>
  );
};

export default Logbook;
