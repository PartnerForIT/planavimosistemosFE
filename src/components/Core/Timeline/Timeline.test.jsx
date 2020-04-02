import React from 'react';
import { render, cleanup } from '@testing-library/react';
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

describe('Timeline', () => {
  afterEach(cleanup);

  it('displays timeline', () => {
    const { getAllByText } = render(
      <Timeline data={data.spans} total={data.total} startMinute={datetimeToMinutes('2019-01-24 07:21:04')} />,
    );

    const arr7 = getAllByText('07:21');
    for (let i = 0; i < arr7.length; i += 1) {
      expect(arr7[i]).toBeInTheDocument();
    }

    const arr12 = getAllByText('17:48');
    for (let i = 0; i < arr12.length; i += 1) {
      expect(arr12[i]).toBeInTheDocument();
    }

    const arr14 = getAllByText('20:48');
    for (let i = 0; i < arr14.length; i += 1) {
      expect(arr14[i]).toBeInTheDocument();
    }

    const arr17 = getAllByText('23:22');
    for (let i = 0; i < arr17.length; i += 1) {
      expect(arr17[i]).toBeInTheDocument();
    }
  });
});
