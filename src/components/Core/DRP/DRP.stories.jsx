import React from 'react';

import DRP from './DRP';
// import '../../App/App.module.scss';

export default {
  component: DRP,
  title: 'DateRangePicker',
};

export const normal = () => (
  <div>
    <DRP initRange={{}} open />
  </div>
);
