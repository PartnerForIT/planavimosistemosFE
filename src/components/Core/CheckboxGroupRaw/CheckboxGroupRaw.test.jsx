import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CheckboxGroupRaw from './CheckboxGroupRaw';

const items = [
  {
    id: 1,
    label: 'Employee Name',
    checked: true,
  },
  {
    id: 2,
    label: 'Employee Name 2',
    checked: false,
  },
];

describe('Checkbox', () => {
  afterEach(cleanup);

  it('displays label', () => {
    const { getByText } = render(<CheckboxGroupRaw items={items} />);
    const element = getByText('Employee Name');
    expect(element).toBeInTheDocument();
    const element2 = getByText('Employee Name 2');
    expect(element2).toBeInTheDocument();
  });
});
