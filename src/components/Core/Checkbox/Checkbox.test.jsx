import React from 'react';
import { render, cleanup } from '@testing-library/react';

import Checkbox from './Checkbox';

const testLabel = 'Hello World';

describe('Checkbox', () => {
  afterEach(cleanup);

  it('displays label', () => {
    const { getByText } = render(<Checkbox label={testLabel} />);
    const element = getByText(testLabel);
    expect(element).toBeInTheDocument();
  });

  it('renders to the document', () => {
    render(<Checkbox defaultChecked />);
    const element = document.querySelector('[checked=""]');
    expect(element).toBeInTheDocument();
  });
});
