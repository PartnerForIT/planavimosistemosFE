import React from 'react';
import { action } from '@storybook/addon-actions';

import Button from './Button';
// import '../../App/App.module.scss';

export default {
  component: Button,
  title: 'Button',
};

export const normal = () => <Button onClick={action('clicked')}>Hello Button</Button>;

export const small = () => (
  <Button onClick={action('clicked')} size='small'>
    Small Button
  </Button>
);

export const big = () => (
  <Button onClick={action('clicked')} size='big'>
    Big Button
  </Button>
);

export const inversed = () => (
  <Button onClick={action('clicked')} inverse>
    Inversed Button
  </Button>
);


export const fullWidth = () => (
  <Button onClick={action('clicked')} fillWidth>
    Full Width Button
  </Button>
);

export const submit = () => (
  <Button onClick={action('clicked')} type='submit'>
    Submit Button
  </Button>
);

export const reset = () => (
  <Button onClick={action('clicked')} type='reset'>
    Reset Button
  </Button>
);
