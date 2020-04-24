import React from 'react';
import { render, cleanup } from '@testing-library/react';
import InfoCard from './InfoCard';

const data = {
  id: 358,
  started_at: '2019-04-29 08:45:39',
  finished_at: '2019-04-30 01:12:01',
  employee_id: 31,
  speciality_id: 34,
  project_id: 11,
  employee: 'TestUser User',
  speciality: 'Dazymo darbai',
  project: '2080 Norköping hus',
  start: '08:45:39',
  end: '01:12:01',
  net_duration: 965,
  duration: '16:05',
  total_duration: 986,
};

const label = 'Total hours';
const text = '$2000';

describe('InfoCard', () => {
  afterEach(cleanup);

  it('displays InfoCard time range', () => {
    const { getByText } = render(
      <InfoCard type='total' label={label} text={text} time={data} showRange />,
    );

    const timeRange = getByText('08:45 - 01:12');
    expect(timeRange).toBeInTheDocument();
  });

  it('displays InfoCard label', () => {
    const { getByText } = render(
      <InfoCard label={label} />,
    );

    const renderedLabel = getByText(label);
    expect(renderedLabel).toBeInTheDocument();
  });

  it('displays InfoCard text', () => {
    const { getByText } = render(
      <InfoCard label={label} text={text} />,
    );

    const renderedText = getByText(text);
    expect(renderedText).toBeInTheDocument();
  });
});
