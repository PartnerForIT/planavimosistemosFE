import React from 'react';
import StyledCheckbox from './Checkbox';

export default {
  component: StyledCheckbox,
  title: 'StyledCheckbox',
};

export const normal = () => <StyledCheckbox label='Styled Checkbox' />;
export const checked = () => <StyledCheckbox label='Checked' defaultChecked />;
export const disabled = () => <StyledCheckbox label='Disabled' disabled />;
