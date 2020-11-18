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
import styles from './dasboard.module.scss';

const useStyles = makeStyles(() => ({
  accordion: {
    width: '100%',
    boxShadow: 'none',
    background: 'transparent',
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
    margin: '5px 0',
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
      <Accordion className={classes.accordion} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={section === 'general' ? classes.activeIcon : classes.icon} />}
          className={section === 'general' ? classes.accordionActiveDiv : classes.accordionDiv}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <GenaralIcon fill={section === 'general' ? '4080fc' : '#808f94'} />
          <span className={styles.menuText}>General</span>
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
    </div>
  )
}