import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ClosableCard from './ClosableCard';

const data = {
  id: 0,
  start_date: '2019-09-29',
  end_date: '2019-09-30',
};

const title = 'Object and employee report';

describe('ClosableCard', () => {
  afterEach(cleanup);

  it('displays ClosableCard title', () => {
    const { getByText } = render(
      <ClosableCard title={title} dateRange={data} />,
    );
    const titleText = getByText(title);
    expect(titleText).toBeInTheDocument();
  });

  it('displays ClosableCard date range', () => {
    const { getByText } = render(
      <ClosableCard
        title={title}
        description={`${data.start_date} - ${data.end_date}`}
        reportId='1'
        onClick={console.log}
        onClose={console.log}
      />,
    );
    const dateRange = getByText(`${data.start_date} - ${data.end_date}`);
    expect(dateRange).toBeInTheDocument();
  });

  // it('displays ClosableCard selected', () => {
  //   const { getByTestId } = render(
  //     <ClosableCard
  //       title={title}
  //       description={`${data.start_date} - ${data.end_date}`}
  //       reportId='1'
  //       selected
  //       onClick={console.log}
  //       onClose={console.log}
  //     />,
  //   );
  //   const element = getByTestId('closablecard');
  //   userEvent.click(element);
  //   expect(element).toHaveClass('cardSelected');
  // });
});
