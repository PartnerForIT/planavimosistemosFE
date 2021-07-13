import React from 'react';
import { useTranslation } from 'react-i18next';

import Item from './Item';
import classes from './Footer.module.scss';

export default ({
  data,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.footer}>
      {
        data.map((item, index) => (
          <Item key={`${item}-${index}`} />
        ))
      }
    </div>
  );
};
