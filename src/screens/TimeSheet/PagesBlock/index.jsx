import React from 'react';

import { useTranslation } from 'react-i18next';
import FlatButton from '../../../components/Core/FlatButton/FlatButton';


export default ({
  page,
  totalPages,
  onPageChange,
  tooltip,
}
) => {
  const { t } = useTranslation();
  
  return (
  <div className='timeSheet-screen__footer'>
    <FlatButton
      onClick={() => {
        onPageChange(1)
      }}
      disabled={page === 1}
    >
      {t('First')}
    </FlatButton>

    <FlatButton
      onClick={() => {
        if (page > 1) {
          onPageChange(page - 1);
        }
      }}
      disabled={page === 1}
    >
      {t('Previous')}
    </FlatButton>
    
    {Array.from({ length: totalPages }).slice(Math.max(0, page - 5), Math.min(page + 4, totalPages)).map((_, i) => {
      const pageNumber = i + Math.max(0, page - 5) + 1;
      return (
        <span
          key={pageNumber}
          data-for='employees_tooltip'
          data-tip={page === pageNumber ? null : tooltip(pageNumber)}
        >
          <FlatButton
            onClick={() => {
              onPageChange(pageNumber);
            }}
            disabled={page === pageNumber}
          >
            {pageNumber}
          </FlatButton>
        </span>
      );
    })}

    <FlatButton
      onClick={() => {
        if (page < totalPages) {
          onPageChange(page + 1);
        }
      }}
      disabled={page === totalPages}
    >
      {t('Next')}
    </FlatButton>

    <FlatButton
      onClick={() => {
        onPageChange(totalPages);
      }}
      disabled={page === totalPages}
    >
      {t('Last')}
    </FlatButton>
  </div>
  );
};