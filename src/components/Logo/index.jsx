import React from 'react';
import { useTranslation } from 'react-i18next';
import LogoOnWhite from '../../assets/Planavimo logo on white.png';
import classes from './Logo.module.scss';

const Logo = ({ src = LogoOnWhite, alt = 'Planavimo logo', ...props }) => {
  const { t } = useTranslation();
  return (
    <>
      <img
        src={src}
        alt={t(alt)}
        className={classes.logo}
        loading='lazy'
        {...props}
      />
    </>
  );
};

export default Logo;
