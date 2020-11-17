import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaynLayout from '../Core/MainLayout';
import TitleBlock from '../Core/TitleBlock';
import PeopleIcon from '../Icons/2Peple';
import OverviewInfoBlock from './overviewInfoBlock';
import {getOverview} from '../../store/overview/actions';
import {overviewSelector, isLoadingSelector} from '../../store/overview/selectors';
import Progress from '../Core/Progress';
import styles from './Overview.module.scss';


export default function Overview() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOverview())
  }, [])
  const users = useSelector(overviewSelector);
  const isLoading = useSelector(isLoadingSelector);
  return(
    <MaynLayout>
      <TitleBlock  
        title={"Overview"}
      >
      <PeopleIcon />  
      </TitleBlock>
      
      <div className={styles.overview}>
      {users &&
        <div className={styles.overview__inner}>
          <OverviewInfoBlock text={"Total users"} number={users.total_users} />
          <OverviewInfoBlock text={"Users logged in"} number={users.online_users} />
          <OverviewInfoBlock text={"Total active users"} number={users.active_users} />
          <OverviewInfoBlock text={"Users clocked in"} number={users.clocked_in_users} />
        </div>
      }
      {isLoading && <Progress />}
      </div>
 

    </MaynLayout>
  )
}