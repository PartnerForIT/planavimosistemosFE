import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import InfoCard from './InfoCard';

const stories = storiesOf('InfoCard', module);

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
