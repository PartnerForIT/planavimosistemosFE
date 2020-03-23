import React from 'react';
import Timeline from './Timeline';

const data = {
  total: '08:00',
  spans: [
    {
      work_date: '2019-09-19',
      start: '07:00',
      end: '12:00',
      comment: 'A lot of customers, good day',
      duration: '05:00',
      status: 'Approved',
    },
    {
      work_date: '2019-09-29',
      start: '12:00',
      end: '14:00',
      comment: 'A lot of drunk people',
      duration: '02:00',
      status: 'Pending',
    },
    {
      work_date: '2019-09-19',
      start: '14:00',
      end: '17:00',
      comment: 'No customers for today',
      duration: '02:00',
      status: 'Approved',
    },
  ],
};

export default {
  component: Timeline,
  title: 'Timeline',
};

export const normal = () => <Timeline data={data.spans} total={data.total} withTimeBreaks />;
