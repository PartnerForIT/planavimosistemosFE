import React, { useCallback, useState } from 'react';
import { storiesOf } from '@storybook/react';
import SvgIcon from '@material-ui/core/SvgIcon';
// import classNames from 'classnames';
import DataTable from './DTM';

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

const ApprovedIcon = () => (
  <SvgIcon viewBox='0 0 16 16'>
    <g id='Group_2217' data-name='Group 2217' transform='translate(-47 -243)'>
      <g
        id='Ellipse_28'
        data-name='Ellipse 28'
        transform='translate(47 243)'
        fill='#57d05a'
        stroke='#fff'
        strokeWidth='1'
      >
        <circle cx='8' cy='8' r='8' stroke='none' />
        <circle cx='8' cy='8' r='7.5' fill='none' />
      </g>
      <path
        id='Path_12586'
        data-name='Path 12586'
        d='M14625.123,9232.507l2.775,3.665,3.886-5.131'
        transform='translate(-14573.78 -8982.273)'
        fill='none'
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1'
      />
    </g>
  </SvgIcon>
);

const SuspendedIcon = ({ className }) => (
  <SvgIcon viewBox='0 0 16 16' className={className}>
    <g id='Group_2214' data-name='Group 2214' transform='translate(-47 -302)'>
      <g
        id='Ellipse_29'
        data-name='Ellipse 29'
        transform='translate(47 302)'
        fill='#f4373e'
        stroke='#fafbfc'
        strokeWidth='1'
      >
        <circle cx='8' cy='8' r='8' stroke='none' />
        <circle cx='8' cy='8' r='7.5' fill='none' />
      </g>
      <path
        id='Path_12587'
        data-name='Path 12587'
        d='M14705.482,9316.87l-5.191,5.207'
        transform='translate(-14647.906 -9009.42)'
        fill='none'
        stroke='#fff'
        strokeLinecap='round'
        strokeWidth='1'
      />
      <path
        id='Path_12590'
        data-name='Path 12590'
        d='M14700.291,9316.87l5.191,5.207'
        transform='translate(-14647.906 -9009.42)'
        fill='none'
        stroke='#fff'
        strokeLinecap='round'
        strokeWidth='1'
      />
    </g>
  </SvgIcon>
);

const PendingIcon = ({ className }) => (
  <SvgIcon viewBox='0 0 16 16' className={className}>
    <defs>
      <clipPath id='clip-path'>
        <rect id='Rectangle_70936' data-name='Rectangle 70936' width='13.568' height='13.568' fill='#ffac00' />
      </clipPath>
    </defs>
    <g id='Group_2216' data-name='Group 2216' transform='translate(-47 -422)'>
      <g id='Group_1639' data-name='Group 1639' transform='translate(0 60)'>
        <g
          id='Ellipse_30'
          data-name='Ellipse 30'
          transform='translate(47 362)'
          fill='#fff'
          stroke='#fafbfc'
          strokeWidth='1'
        >
          <circle cx='8' cy='8' r='8' stroke='none' />
          <circle cx='8' cy='8' r='7.5' fill='none' />
        </g>
      </g>
      <g id='Group_1648' data-name='Group 1648' transform='translate(48.192 423.192)'>
        <g id='Group_1643' data-name='Group 1643' transform='translate(0 0)' clipPath='url(#clip-path)'>
          <path
            id='Subtraction_1'
            data-name='Subtraction 1'
            d='M6.786,13.57A6.767,6.767,0,0,1,2,2a6.711,6.711,0,0,1,9.565,0A6.782,6.782,0,0,1,6.786,13.57ZM3.3,6.58a.462.462,0,0,0,0,.924H6.779a.46.46,0,0,0,.465-.465V2.9a.458.458,0,0,0-.465-.46.45.45,0,0,0-.46.46V6.58Z'
            transform='translate(-0.001 -0.002)'
            fill='#ffac00'
            stroke='rgba(0,0,0,0)'
            strokeMiterlimit='10'
            strokeWidth='1'
          />
        </g>
      </g>
    </g>
  </SvgIcon>
);
/* eslint max-len: ["error", { "ignoreStrings": true }] */
const SortIcon = ({ className }) => (
  <SvgIcon viewBox='0 0 24.27 11.625' className={className}>
    <g id='Group_2284' data-name='Group 2284' transform='translate(-108.365 -182.188)' opacity='0.6'>
      <path
        id='Path_13294'
        data-name='Path 13294'
        d='M6.444.082A.647.647,0,0,0,7.117-.6V-8.079L7.068-9.387,8.637-7.636l1.381,1.369a.678.678,0,0,0,.479.2.637.637,0,0,0,.648-.66.668.668,0,0,0-.212-.485l-3.992-4a.688.688,0,0,0-.5-.212.692.692,0,0,0-.5.212l-3.986,4a.668.668,0,0,0-.212.485.632.632,0,0,0,.642.66.681.681,0,0,0,.485-.2L4.245-7.636,5.82-9.393,5.766-8.079V-.6A.649.649,0,0,0,6.444.082Z'
        transform='translate(106.622 193.731)'
        fill='#808f94'
      />
      <path
        id='Path_13295'
        data-name='Path 13295'
        d='M4.7,11.5a.647.647,0,0,0,.672-.679V3.344L5.325,2.036,6.894,3.786,8.276,5.156a.678.678,0,0,0,.479.2A.637.637,0,0,0,9.4,4.7.668.668,0,0,0,9.19,4.21L5.2.212a.7.7,0,0,0-1,0l-3.986,4A.668.668,0,0,0,0,4.7a.632.632,0,0,0,.642.66.681.681,0,0,0,.485-.2L2.5,3.786,4.077,2.03,4.023,3.344v7.482A.649.649,0,0,0,4.7,11.5Z'
        transform='translate(132.635 193.692) rotate(180)'
        fill='#808f94'
      />
    </g>
  </SvgIcon>
);

const columns = [
  { title: 'Status', field: 'status', icons: [<ApprovedIcon />, <SuspendedIcon />, <PendingIcon />] },
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

const DataTableContainer = () => {
  const [itemsArray, setItemsArray] = useState(data);

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
      columns={columns}
      selectable
      sortable
      onSelect={selectionHandler}
      onSort={sortHandler}
      fieldIcons={icons}
      sortIcon={<SortIcon />}
    />
  );
};

const stories = storiesOf('DataTableCustom', module);

stories.add('normal', () => <DataTableContainer />);
