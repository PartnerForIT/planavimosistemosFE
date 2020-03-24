import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import InfoCard from './InfoCard';

const stories = storiesOf('InfoCard', module);

const data = {
  work_date: '2019-09-29',
  start: '14:56',
  end: '18:00',
  comment: 'A lot of drunk people',
  duration: '03:04',
  status: 'Pending',
};

const Container = () => {
  const [time, setTime] = useState(data);

  return (
    <div style={{ width: '300px' }}>
      <InfoCard
        type='total'
        label='Total hours'
        text='$2000'
        time={time}
        editable
        onChange={setTime}
      />
    </div>
  );
};

stories.add('normal', () => <Container style={{ width: '300px' }} />);
