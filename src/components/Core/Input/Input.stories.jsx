import React from 'react';
import Input from './Input';
import SearchIcon from '../../Icons/SearchIcon';

export default {
  component: Input,
  title: 'Input',
};

export const normal = () => <Input icon={<SearchIcon />} width='186px' height='36px' />;

export const withoutIcon = () => <Input placeholder='Input without icon' width='186px' height='36px' />;
