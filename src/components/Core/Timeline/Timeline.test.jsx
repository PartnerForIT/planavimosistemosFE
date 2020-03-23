import React from 'react';
import { render, cleanup } from '@testing-library/react';
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

describe('Input', () => {
  afterEach(cleanup);

  it('displays timeline', () => {
    const { getAllByText } = render(
      <Timeline data={data.spans} total={data.total} />,
    );

    const arr7 = getAllByText('07:00');
    for (let i = 0; i < arr7.length; i += 1) {
      expect(arr7[i]).toBeInTheDocument();
    }

    const arr12 = getAllByText('12:00');
    for (let i = 0; i < arr12.length; i += 1) {
      expect(arr12[i]).toBeInTheDocument();
    }

    const arr14 = getAllByText('14:00');
    for (let i = 0; i < arr14.length; i += 1) {
      expect(arr14[i]).toBeInTheDocument();
    }

    const arr17 = getAllByText('17:00');
    for (let i = 0; i < arr17.length; i += 1) {
      expect(arr17[i]).toBeInTheDocument();
    }
  });
});
