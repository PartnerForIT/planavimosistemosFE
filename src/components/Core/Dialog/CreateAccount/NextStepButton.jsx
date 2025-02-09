import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../Button/Button';
import ArrowRightOutlined from '../../../Icons/ArrowRightOutlined';

const NextStepButton = ({ onClick, className, disabled}) => {
  const { t } = useTranslation();

  return (
    <Button className={className} inverse size='big' onClick={onClick} disabled={disabled} >
      <span>
        {t('Next')}
        {' '}
        <ArrowRightOutlined aria-hidden />
      </span>
    </Button>
  );
};

export default NextStepButton;
