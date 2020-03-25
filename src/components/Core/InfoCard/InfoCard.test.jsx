import React from 'react';
import { render, cleanup } from '@testing-library/react';
import InfoCard from './InfoCard';

const data = {
  work_date: '2019-09-29',
  start: '14:56',
  end: '18:00',
  comment: 'A lot of drunk people',
  duration: '03:04',
  status: 'Pending',
};

const label = 'Total hours';
const text = '$2000';

describe('InfoCard', () => {
  afterEach(cleanup);

  it('displays InfoCard time range', () => {
    const { getByText } = render(
      <InfoCard type='total' label={label} text={text} time={data} />,
    );

    const timeRange = getByText('14:56 - 18:00');
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
