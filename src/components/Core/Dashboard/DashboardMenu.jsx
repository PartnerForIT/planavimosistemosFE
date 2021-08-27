import React, { useMemo } from 'react';
import Accordion from '@material-ui/core/Accordion';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, Link } from 'react-router-dom';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

import GenaralIcon from '../../Icons/GeneralIcon';
import AccountIcon from '../../Icons/AccountsIcon';
import ScheduleIcon from '../../Icons/Schedule';
import LogbookIcon from '../../Icons/LogbookIcon';
import EventsIcon from '../../Icons/Events';
import CategoriesIcon from '../../Icons/Categories';
import ActivityLogIcon from '../../Icons/ActivityLog';
import DeleteIcon from '../../Icons/DeleteIcon';
import KioskIcon from '../../Icons/Kiosk';
import styles from './dasboard.module.scss';
import usePermissions from '../usePermissions';

const useStyles = makeStyles(() => ({
  accordion: {
    width: '100%',
    boxShadow: 'none',
    background: 'transparent',
    '&::before': {
      display: 'none',
    },
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
  },
  expanded: {
    marginTop: '0 !important',
  },
  rounded: { margin: 0 },
  expandIcon: {
    transform: 'rotate(270deg)',
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      fontSize: '1em',
    },
  },
  summaryExpanded: {
    '&:last-child': {
      transform: 'rotate(360deg)',
    },
  },
  content: {
    alignItems: 'center',
  },
}));

const permissionsConfig = [
  {
    name: 'activity_log',
    permission: 'activity_log_view',
    module: 'activity_log',
  },
  {
    name: 'groups',
    module: 'create_groups',
    permission: 'groups_create',
  },
  {
    name: 'logbook',
    module: 'logbook',
    permission: 'logbook_module_access',
  },
  {
    name: 'logbook_edit_settings',
    permission: 'logbook_edit_settings',
  },
  {
    name: 'events',
    module: 'events',
    permission: 'events_create',
  },
  {
    name: 'company_edit_settings',
    permission: 'company_edit_settings',
  },
  {
    name: 'roles_create',
    permission: 'roles_create',
  },
  {
    name: 'data_delete',
    permission: 'data_delete',
  },
  {
    name: 'categories_create',
    permission: 'categories_create',
  },
  {
    name: 'accounts_see_and_edit',
    permission: 'accounts_see_and_edit',
  },
  {
    name: 'kiosk',
    permission: 'kiosk_create',
    module: 'kiosk',
  },
  {
    name: 'schedule_shift',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_simple',
    module: 'schedule_simple',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'schedule_module',
    permission: 'schedule_module_access',
  },
];
export default function DashboardMenu() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id: companyId } = useParams();
  const { pathname } = useLocation();
  const [,,, section, innerSection] = pathname.split('/');
  const permissions = usePermissions(permissionsConfig);

  const menuItems = useMemo(() => {
    const nextMenuItems = [];

    if (permissions.company_edit_settings) {
      nextMenuItems.push({
        icon: GenaralIcon,
        title: t('General'),
        name: 'general',
        items: [
          {
            to: `/${companyId}/settings/general/company`,
            name: 'company',
            title: t('Company'),
          },
          {
            to: `/${companyId}/settings/general/work-time`,
            name: 'work-time',
            title: t('Work Time'),
          },
          {
            to: `/${companyId}/settings/general/security`,
            name: 'security',
            title: t('Security'),
          },
        ],
      });
    }

    if (permissions.accounts_see_and_edit || permissions.roles_create || permissions.groups) {
      const subItems = [];

      if (permissions.accounts_see_and_edit) {
        subItems.push({
          to: `/${companyId}/settings/accounts/accounts-list`,
          name: 'accounts-list',
          title: t('Accounts list'),
        });
      }

      if (permissions.roles_create) {
        subItems.push({
          to: `/${companyId}/settings/accounts/roles`,
          name: 'roles',
          title: t('Roles'),
        });
      }

      if (permissions.groups) {
        subItems.push({
          to: `/${companyId}/settings/accounts/grouping`,
          name: 'grouping',
          title: t('Grouping'),
        });
      }

      nextMenuItems.push({
        icon: AccountIcon,
        title: t('Accounts'),
        name: 'accounts',
        items: subItems,
      });
    }

    if (permissions.logbook && permissions.logbook_edit_settings) {
      nextMenuItems.push({
        icon: LogbookIcon,
        title: t('Logbook'),
        name: 'logbook',
        items: [
          {
            to: `/${companyId}/settings/logbook/journal`,
            name: 'journal',
            title: t('Journal'),
          },
          {
            to: `/${companyId}/settings/logbook/overtime`,
            name: 'overtime',
            title: t('Overtime'),
          },
        ],
      });
    }

    // Kiosk
    if (permissions.kiosk) {
      nextMenuItems.push({
        icon: KioskIcon,
        title: t('Kiosk'),
        name: 'kiosk',
        items: [
          {
            to: `/${companyId}/settings/kiosk/kiosk-list`,
            name: 'kiosk-list',
            title: t('Kiosk list'),
          },
          {
            to: `/${companyId}/settings/kiosk/users`,
            name: 'users',
            title: t('Kiosk users'),
          },
        ],
      });
    }

    if (permissions.events) {
      nextMenuItems.push({
        to: `/${companyId}/settings/events`,
        icon: EventsIcon,
        title: t('Events'),
        name: 'events',
      });
    }

    // Schedule
    if ((permissions.schedule_shift || permissions.schedule_simple) && permissions.schedule_module) {
      nextMenuItems.push({
        to: `/${companyId}/settings/schedule`,
        icon: ScheduleIcon,
        title: t('Schedule'),
        name: 'schedule',
      });
    }

    if (permissions.activity_log) {
      nextMenuItems.push({
        to: `/${companyId}/settings/activity-log`,
        icon: ActivityLogIcon,
        title: t('Activity Log'),
        name: 'activity-log',
      });
    }

    if (permissions.data_delete) {
      nextMenuItems.push({
        to: `/${companyId}/settings/delete`,
        icon: DeleteIcon,
        title: t('Data Delete'),
        name: 'delete',
      });
    }

    if (permissions.categories_create) {
      nextMenuItems.push({
        to: `/${companyId}/settings/categories`,
        icon: CategoriesIcon,
        title: t('Categories'),
        name: 'categories',
      });
    }

    return nextMenuItems;
  }, [permissions, companyId, t]);

  const IconWrapper = ({ children }) => (
    <div className={styles.iconWrapper}>
      {children}
    </div>
  );

  return (
    <div className={styles.dashboardMenu}>
      <div className={styles.dashboardScroll}>
        {
          menuItems.map((item, index) => (
            item.items ? (
              <Accordion
                className={classes.accordion}
                defaultExpanded={section === item.name}
                classes={{
                  expanded: classes.expanded,
                }}
                key={item.name}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon className={section === item.name ? classes.activeIcon : classes.icon} />}
                  className={section === item.name ? classes.accordionActiveDiv : classes.accordionDiv}
                  classes={{
                    expandIcon: classes.expandIcon,
                    expanded: classes.summaryExpanded,
                    content: classes.content,
                  }}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                >
                  <IconWrapper>
                    <item.icon fill={section === item.name ? '#4080fc' : '#69767A'} />
                  </IconWrapper>
                  <span className={styles.menuText}>
                    {item.title}
                  </span>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionContent}>
                  <ul className={styles.dashboardLinkBlock}>
                    {
                      item.items.map((subItem) => (
                        <li>
                          <Link
                            to={subItem.to}
                            className={innerSection === subItem.name ? styles.activeLink : styles.link}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Link
                to={item.to}
                className={section === item.name ? styles.activeOnelink : styles.Onelink}
                key={item.name}
              >
                <IconWrapper>
                  <item.icon fill={section === item.name ? '#4080fc' : '#69767A'} />
                </IconWrapper>
                <span className={styles.textLink}>
                  {item.title}
                </span>
              </Link>
            )
          ))
        }
      </div>
    </div>
  );
}
