import React from 'react';
import Timeline from './Timeline';
import { datetimeToMinutes } from '../../Helpers';

const data = {
  total: 960,
  spans: [
    {
      id: 340,
      employee_id: 34,
      project_id: 18,
      speciality_id: 46,
      started_at: '2019-01-24 07:21:04',
      finished_at: '2019-01-24 17:48:50',
      created_at: '2019-01-24 15:48:50',
      updated_at: '2019-01-24 15:48:50',
      deleted_at: null,
      duration: 627,
    },
    {
      id: 341,
      employee_id: 34,
      project_id: 18,
      speciality_id: 46,
      started_at: '2019-01-24 20:48:50',
      finished_at: '2019-01-24 23:22:02',
      created_at: '2019-01-24 21:22:02',
      updated_at: '2019-01-24 21:22:02',
      deleted_at: null,
      duration: 153,
    },
  ],
};

export default {
  component: Timeline,
  title: 'Timeline',
};

export const normal = () => (
  <Timeline
    data={data.spans}
    total={data.total}
    startMinute={datetimeToMinutes('2019-01-24 07:21:04')}
    withTimeBreaks
  />
);
