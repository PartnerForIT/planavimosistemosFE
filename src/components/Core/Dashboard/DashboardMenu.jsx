import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import GenaralIcon from '../../Icons/GeneralIcon';
import AccountIcon from '../../Icons/AccountsIcon';
import LogbookIcon from '../../Icons/Logbook2';
import styles from './dasboard.module.scss';

const useStyles = makeStyles(() => ({
  accordion: {
    width: '100%',
    boxShadow: 'none',
    background: 'transparent',
    '&::before': {
      display: 'none',
    }
  },
  accordionDiv: {
    padding: '0px 0px 10px 5px',
    height: '40px',
    minHeight: '40px !important',
    color: '#69767A',
    fontSize: '16px',
    fontWeight: '600',
  },
  accordionActiveDiv: {
    padding: '0px 0px 10px 5px',
    height: '40px',
    minHeight: '40px !important',
    color: '#4080fc',
    fontSize: '16px',
    fontWeight: '600',
  },
  accordionContent: {
    margin: '0 0 5px 0',
    padding: 0,
  },
  activeIcon: {
    fill: '#4080fc',
  },
  icon: {
    fill: '#69767A',
  }
}));

export default function DashboardMenu() {
  const classes = useStyles();
  const { t } = useTranslation();
  const params = useParams();
  const { pathname } = useLocation();
  const section = pathname.split('/')[2];
  const innerSection = pathname.split('/')[3];
  return (
    <div className={styles.dashboardMenu}>
      {/* General */}
      <Accordion className={classes.accordion} defaultExpanded={section === 'general' ? true : false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={section === 'general' ? classes.activeIcon : classes.icon} />}
          className={section === 'general' ? classes.accordionActiveDiv : classes.accordionDiv}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <GenaralIcon fill={section === 'general' ? '4080fc' : '#808f94'} />
          <span className={styles.menuText}>{t('General')}</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionContent}>
          <ul className={styles.dashboardLinkBlock}>
            <li>
              <Link
                to={`/settings/general/company/${params.id}`}
                className={innerSection === `company` ? styles.activelink : styles.link}
              >
                {t('Company')}
              </Link>
            </li>
            <li>
              <Link
                to={`/settings/general/work-time/${params.id}`}
                className={innerSection === `work-time` ? styles.activelink : styles.link}
              >
                {t('Work Time')}
              </Link>
            </li>
            <li>
              <Link
                to={`/settings/general/security/${params.id}`}
                className={innerSection === `security` ? styles.activelink : styles.link}
              >
                {t('Security')}
              </Link>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      {/* Accounts */}
      <Accordion className={classes.accordion} defaultExpanded={section === 'accounts' ? true : false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={section === 'accounts' ? classes.activeIcon : classes.icon} />}
          className={section === 'accounts' ? classes.accordionActiveDiv : classes.accordionDiv}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <AccountIcon fill={section === 'accounts' ? '4080fc' : '#808f94'} />
          <span className={styles.menuText}>{t('Accounts')}</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionContent}>
          <ul className={styles.dashboardLinkBlock}>
            <li>
              <Link
                to={`/settings/accounts/accounts-list/${params.id}`}
                className={innerSection === `accounts-list` ? styles.activelink : styles.link}
              >
                {t('Accounts list')}
              </Link>
            </li>
            <li>
              <Link
                to={`/settings/accounts/roles/${params.id}`}
                className={innerSection === `roles` ? styles.activelink : styles.link}
              >
                {t('Roles')}
              </Link>
            </li>
            <li>
              <Link
                to={`/settings/accounts/grouping/${params.id}`}
                className={innerSection === `grouping` ? styles.activelink : styles.link}
              >
                {t('Grouping')}
              </Link>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
      {/* Logbook */}
      <Accordion className={classes.accordion} defaultExpanded={section === 'logbook' ? true : false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={section === 'logbook' ? classes.activeIcon : classes.icon} />}
          className={section === 'logbook' ? classes.accordionActiveDiv : classes.accordionDiv}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <LogbookIcon fill={section === 'logbook' ? '4080fc' : '#808f94'} />
          <span className={styles.menuText}>{t('LogBook')}</span>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionContent}>
          <ul className={styles.dashboardLinkBlock}>
            <li>
              <Link
                to={`/settings/logbook/journal/${params.id}`}
                className={innerSection === `journal` ? styles.activelink : styles.link}
              >
                {t('Journal')}
              </Link>
            </li>
            <li>
              <Link
                to={`/settings/logbook/overtime/${params.id}`}
                className={innerSection === `overtime` ? styles.activelink : styles.link}
              >
                {t('Overtime')}
              </Link>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}