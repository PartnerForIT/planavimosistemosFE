import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../Button/Button';
import ArrowRightOutlined from '../../../Icons/ArrowRightOutlined';

const NextStepButton = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <Button inverse size='big' onClick={onClick}>
        <span>
          {t('Next')}
          {' '}
          <ArrowRightOutlined aria-hidden />
        </span>
      </Button>
    </>
  );
};

export default NextStepButton;
