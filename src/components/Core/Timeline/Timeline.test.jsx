import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Timeline from './Timeline';

const employee = {
  id: 31,
  name: 'TestUser',
  surname: 'User',
  company_name: 'TestCompany',
  personal_number: '85500000',
  phone: '86000000',
  email: 'test@test.com',
  speciality_id: null,
  status: '1',
  created_at: '2018-09-21 08:11:56',
  updated_at: '2020-01-07 14:16:00',
  deleted_at: null,
  first_login: 1,
  works: [
    {
      id: 413,
      employee_id: 31,
      project_id: 14,
      speciality_id: 45,
      session_id: 21,
      started_at: '2020-04-08 09:57:38',
      finished_at: '2020-04-08 09:58:49',
      created_at: '2020-04-08 09:57:49',
      updated_at: '2020-04-08 09:57:49',
      deleted_at: null,
      duration: 1,
      duration_sec: 71,
    },
    {
      id: 414,
      employee_id: 31,
      project_id: 14,
      speciality_id: 45,
      session_id: 21,
      started_at: '2020-04-08 10:00:02',
      finished_at: '2020-04-08 10:02:32',
      created_at: '2020-04-08 09:58:32',
      updated_at: '2020-04-08 09:58:32',
      deleted_at: null,
      duration: 2,
      duration_sec: 150,
    },
  ],
  breaks: [
    {
      id: 2,
      employee_id: 31,
      project_id: 14,
      speciality_id: 45,
      session_id: 21,
      started_at: '2020-04-08 09:58:49',
      finished_at: '2020-04-08 10:00:02',
      created_at: '2020-04-08 09:58:02',
      updated_at: '2020-04-08 09:58:02',
      deleted_at: null,
      duration: 1,
      duration_sec: 73,
    },
  ],
  total_work_sec: 221,
  total_break_sec: 73,
};

const selectedItem = {
  id: 414,
  started_at: '2020-04-08 09:57:38',
  finished_at: '2020-04-08 10:02:32',
  employee_id: 31,
  session_id: 21,
  speciality_id: 45,
  project_id: 14,
  employee: 'TestUser User',
  speciality: 'Pertvaru statymas, gipsavimas',
  project: 'KungsKvarnen AB',
  start: '09:57',
  end: '10:02',
  net_duration: 3,
  duration: '00:03',
  total_duration: 4,
};

describe('Timeline', () => {
  afterEach(cleanup);

  it('displays timeline', () => {
    const { getAllByText } = render(
      <Timeline
        works={employee.works}
        breaks={employee.breaks}
        total={employee.total_work_sec + employee.total_break_sec}
        startMinute={selectedItem.started_at}
        withTimeBreaks
      />,
    );

    const arr7 = getAllByText('09:57');
    for (let i = 0; i < arr7.length; i += 1) {
      expect(arr7[i]).toBeInTheDocument();
    }

    const arr12 = getAllByText('09:58');
    for (let i = 0; i < arr12.length; i += 1) {
      expect(arr12[i]).toBeInTheDocument();
    }

    const arr14 = getAllByText('10:00');
    for (let i = 0; i < arr14.length; i += 1) {
      expect(arr14[i]).toBeInTheDocument();
    }
  });
});
