/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import style from './CreateAccount.module.scss';
import avatar from '../../../Icons/avatar.png';
import CurrencySign from '../../../shared/CurrencySign';

function UserCard({
  user, skills, groups, places,
}) {
  const {
    external_id,
    group,
    subgroup,
    skill,
    place,
    cost,
    charge,
  } = user;

  const skillOpt = useMemo(() => skills.map(({ id, name }) => ({ id, name })), [skills]);
  const groupOpt = useMemo(() => groups.map(({ id, name }) => ({ id, name })), [groups]);
  const placesOpt = useMemo(() => places.map(({ id, name }) => ({ id, name })), [places]);
  const subgroupOpt = useMemo(() => {
    if (group) {
      // eslint-disable-next-line eqeqeq
      const subgroups = groups.find((grp) => grp.id == group)?.subgroups ?? [];
      return subgroups.map(({ id, name }) => ({ id, name }));
    }
    return [];
  }, [group, groups]);

  return (
    <div className={style.card}>
      <div className={style.card_head}>
        <img src={user.photo || avatar} alt='avatar' className={style.avatar} />
        <div className={style.card_name}>
          <p>{`${user.name} ${user.surname}`}</p>
          <small />
        </div>
      </div>
      <div className={style.card_body}>

        <SimpleRow name={external_id} text='External id' />
        <SimpleRow name={skill} text='Skills' parent={skillOpt} />
        <SimpleRow name={group} text='Group' parent={groupOpt} />
        <SimpleRow name={subgroup} text='Subgroup' parent={subgroupOpt} />
        <SimpleRow name={place} text='Place' parent={placesOpt} />
        <SimpleRow name={cost} text='Hourly cost' currency={<CurrencySign />} />
        <SimpleRow name={charge} text='Hourly charge' currency={<CurrencySign />} />

      </div>
    </div>
  );
}

export default UserCard;

const SimpleRow = ({
  name,
  text,
  parent = [],
  currency = '',
}) => {
  const { t } = useTranslation();
  return (
    <>
      {
        name && (
        <p>
          {/* eslint-disable-next-line eqeqeq */}
          {`${t(text)}: ${!parent.length ? name : parent.find((item) => item.id == name)?.name}`}
          {currency}
        </p>
        )
      }
    </>
  );
};
