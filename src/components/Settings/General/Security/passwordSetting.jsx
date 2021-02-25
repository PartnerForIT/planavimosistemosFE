/* eslint-disable camelcase */
import React from 'react';
import Checkbox from '../../../Core/Checkbox/Checkbox2';
import Label from '../../../Core/InputLabel';
import Tooltip from '../../../Core/Tooltip';
import Input from '../../../Core/Input/Input';
import style from './security.module.scss';
import Button from '../../../Core/Button/Button';

export default function passwordSetting({
  t,
  handleChangeSettings, settings,
  min_password_length, changeMinPassword, login_attempts,
  setLogin_attempts, changeSecuritySettings,
}) {
  return (
    <div className={style.passwordSettings}>
      <Label text={t('Password settings')} />
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.send_password}
          label={t('Do not send password via email')}
          name='send_password'
        />
        <div className={style.tooltipBlock}>
          <Tooltip title='Do not send password via email' />
        </div>
      </div>
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.min_length}
          label={t('Minimum password lenght')}
          name='min_length'
        />
        <Input
          value={min_password_length}
          name='min'
          type='number'
          min='1'
          max='12'
          onChange={changeMinPassword}
        />
        <div className={style.tooltipBlock}>
          <Tooltip title='Minimum password lenght' />
        </div>
      </div>
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.numbers}
          label={t('Require Numbers')}
          name='numbers'
        />
        <div className={style.tooltipBlock}>
          <Tooltip title='Require Numbers' />
        </div>
      </div>
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.special_chars}
          label={t('Require special characters')}
          name='special_chars'
        />
        <div className={style.tooltipBlock}>
          <Tooltip title='Require special characters' />
        </div>
      </div>
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.uppercase}
          label={t('Require uppercase letters')}
          name='uppercase'
        />
        <div className={style.tooltipBlock}>
          <Tooltip title='Require uppercase letters' />
        </div>
      </div>
      <div className={style.formLine} />
      <div className={style.settingsBlock2}>
        <Label text={t('Monitoring')} />
        <Tooltip title='Notify administrators of locked account by e-mail' />
      </div>
      <div className={style.settingsBlock2}>
        <div className={style.innerText}>Lock account after</div>
        <Input
          value={login_attempts}
          name='min'
          type='number'
          placeholder='0'
          min='1'
          max='12'
          onChange={(e) => setLogin_attempts(e.target.value)}
        />
        <div className={style.innerText}>failed attempts</div>
      </div>
      <div className={style.settingsBlock}>
        <Checkbox
          onChange={handleChangeSettings}
          checked={settings.notify_admin}
          label={t('Notify administrators of locked account by e-mail')}
          name='notify_admin'
        />
      </div>
      <div className={style.buttonBlock}>
        <Button inverse onClick={() => changeSecuritySettings()}>
          {t('Save security settings')}
        </Button>
      </div>
    </div>
  );
}
