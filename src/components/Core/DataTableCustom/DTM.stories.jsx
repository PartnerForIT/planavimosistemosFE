import React from 'react';
import { action } from '@storybook/addon-actions';
import DataTable from './DTM';

const data = [
  {
    label: '2020-03-17',
    titleColor: '#F59F13',
    backgroundColor: 'rgba(250, 172, 46, 0.1)',
    items: [
      {
        status: 'Pending',
        employee: 'Mehmet Baran',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        status: 'Approved',
        employee: 'Zerya Loren',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Developer',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        status: 'Pending',
        employee: 'Brad Betül',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
        status: 'Pending',
        employee: 'Steve Smith',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-17 16:13:32',
        finishedAtFormatted: '2020-03-17',
      },
      {
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
    label: '2020-03-18',
    items: [
      {
        status: 'Pending',
        employee: 'Tara Betul',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Barmen',
        finishedAt: '2020-03-18 11:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        status: 'Approved',
        employee: 'Zerya Loren',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'Tailor',
        finishedAt: '2020-03-18 19:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        status: 'Suspended',
        employee: 'Brad Jonson',
        group: 'Group A',
        subgroup: 'Sub Group A',
        skill: 'None',
        finishedAt: '2020-03-18 22:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
        status: 'Pending',
        employee: 'Steve Kopernik',
        group: 'Group B',
        subgroup: 'Sub Group A',
        skill: 'None',
        finishedAt: '2020-03-18 21:13:32',
        finishedAtFormatted: '2020-03-18',
      },
      {
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

export default {
  component: DataTable,
  title: 'DataTableCustom',
};

export const normal = () => <DataTable data={data} columns={columns} onSelectionChange={action('changed')} />;
