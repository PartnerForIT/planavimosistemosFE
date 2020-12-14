import React from 'react';
import Button from '../../Button/Button';
import ArrowRightOutlined from '../../../Icons/ArrowRightOutlined';

const NextStepButton = ({ onClick }) => (
  <>
    <Button inverse size='big' onClick={onClick}>
      <span>
        Next
        <ArrowRightOutlined />
      </span>
    </Button>
  </>
);

export default NextStepButton;
