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

const Container = ({ ...props }) => {
  const [time, setTime] = useState(data);

  return (
    <div style={{ width: '300px' }}>
      <InfoCard
        time={time}
        onChange={setTime}
        {...props}
      />
    </div>
  );
};

stories.add('work time', () => (<Container type='total' text='$2000' editable />));
stories.add('break time', () => (<Container type='break' text='$2000' editable />));
stories.add('break time without editing', () => (<Container type='break' text='$2000' />));
stories.add('with custom text', () => (<Container type='other' label='Custom text' text='$2000' time={null} />));
