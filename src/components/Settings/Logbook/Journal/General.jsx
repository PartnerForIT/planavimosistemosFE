import React, { useState, useEffect } from 'react';
import Tooltip from '../../../Core/Tooltip';
import Input from '../../../Core/Input/Input';
import Label from '../../../Core/InputLabel';
import Checkbox from '../../../Core/Checkbox/Checkbox2.jsx';

export default function General({ t, style, handleInputChange, journalData }) {
  return (
    <div>
      <Label text={`${t('General Journal Settings')} :`} />
      <div className={style.generalBlock}>
        <div className={style.labelText}>{t('Cost, Hourly rate')}</div>
        <Input
          value={journalData.hourly_charge}
          type="number"
          min="1"
          width={40}
          name="hourly_charge"
          onChange={handleInputChange}
        />
        <div className={style.labelText2}>$</div>
        <Tooltip title={'Cost hourly rate, entry field, and currency symbol based on general settings currency settings'} />
      </div>
      <div className={style.generalBlock}>
        <div className={style.labelText}>{t('Charge, Hourly rate')}</div>
        <Input
          value={journalData.hourly_cost}
          type="number"
          min="1"
          width={40}
          name="hourly_cost"
          onChange={handleInputChange}
        />
        <div className={style.labelText2}>$</div>
        <Tooltip title={'Charge hourly rate, entry field, and currency symbol based on general settings currency settings'} />
      </div>
      <div className={style.generalBlock}>
        <Checkbox
          onChange={handleInputChange}
          checked={journalData.show_earned_salary}
          label={t('Show earned salary for employees')}
          name={'show_earned_salary'}
        />
        <div className={style.tooltipBlock}>
          <Tooltip title={'The show earned salary for employees checkbox, enables all users to see how much do they earn, this enables view in Mobile and WEB.'} />
        </div>
      </div>
      <div className={style.generalBlock}>
        <Checkbox
          onChange={handleInputChange}
          checked={journalData.merge_entriesy}
          label={t('Merge daily entries to one')}
          name={'merge_entries'}
        />
        <div className={style.tooltipBlock}>
          <Tooltip title={'Merge daily entries to one checkbox - so if user has did two or more working time clock in and clock out, then we will have more than one entries in database and in the logbook and in the reports for that day for that user. But we can merge it, and the merge goes like this:The first entries start time clock in and the last entries of that day finish time clock out. Brakes are merged and calculated as well. Please clarify with me about this one'} />
        </div>
      </div>


    </div>
  )
}