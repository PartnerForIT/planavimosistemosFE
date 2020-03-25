import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import ClosableCard from './ClosableCard';

const stories = storiesOf('ClosableCard', module);

const data = [
  {
    id: 0,
    start_date: '2019-09-29',
    end_date: '2019-09-30',
  },
  {
    id: 1,
    start_date: '2019-10-29',
    end_date: '2019-11-29',
  },
  {
    id: 2,
    start_date: '2020-03-15',
    end_date: '2020-03-22',
  },
  {
    id: 3,
    start_date: '2020-03-22',
    end_date: '2020-03-22',
  },
  {
    id: 4,
    start_date: '2019-03-15',
    end_date: '2020-03-15',
  },
];

const Container = ({ ...props }) => {
  const [reports, setReports] = useState(data);
  const [activeReport, setActiveReport] = useState();

  const closeHandler = (reportId) => {
    const removeReport = (reps) => reps.filter((rep) => rep.id !== reportId);
    setReports(removeReport);
  };

  return (
    <div style={{ display: 'flex', overflowY: 'scroll' }}>
      {
        reports.map((report) => (
          <ClosableCard
            dateRange={report}
            selected={report.id === activeReport}
            onClick={setActiveReport}
            onClose={closeHandler}
            {...props}
          />
        ))
      }
    </div>
  );
};

stories.add('normal', () => (<Container title='Object and employee report' />));
