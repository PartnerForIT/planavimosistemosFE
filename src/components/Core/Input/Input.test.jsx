import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import Input from './Input';

const placeholder = 'input';

describe('Input', () => {
  afterEach(cleanup);

  it('handles change event', (done) => {
    function handleChange() {
      done();
    }
    const { getByPlaceholderText } = render(
      <Input placeholder={placeholder} onChange={handleChange} />,
    );
    const element = getByPlaceholderText(placeholder);
    fireEvent.input(element, { target: { value: '42' } });
  });

  it('displays placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder={placeholder} />,
    );
    const element = getByPlaceholderText(placeholder);
    expect(element).toBeInTheDocument();
  });

  it('can be disabled', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder={placeholder} disabled />,
    );
    const element = getByPlaceholderText(placeholder);
    expect(element.closest('input')).toHaveAttribute('disabled', '');
  });
});
