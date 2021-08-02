import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CloseIcon from '@material-ui/icons/Close';

import ModalItem from './ModalItem';
import classes from './Item.module.scss';

// const photo = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAFKADAAQAAAABAAAAFAAAAACRFdLHAAAEp0lEQVQ4EXWUy28bVRTGv5m587LHTpzYjuPaTVvaIlraTCQqkIrUrJCQWGTFikX5CyBig1SkhhUSEhCExKILEgGiwCZBqAtggUtbCakKmahN2ygkcZw4blLbsR079rw54ypSeI08tmd07+9+5zsPDv9zvfP6K2P3Hjwa3mqaox3X08Hx4DjOEDiWU2RmGEv5H/5rK/fPlz//ekMv5f+cmv7kU71QrhOHgygwOJ4PIoLneTC6BUEw+sLSmzlj2TjM4A8//HTzxsRWYW3+848m9c1KHYoiBarARIFAAYyDQDskkUdI4nVVlubffeO1q4cZwsHDj7/MTPiue3X+1m/YWFkB6YEWUuB6HhhRiEsQETLBZCZAERlc30OsJzL66sUX6rm5xd8DVjfkGxSmb5vzpfwaZr6Ygui7SCTiSKaS2CyW0G536AAf2cEUJIHDVmkHhZ0qLNdFhtacOXUckhoauTI5bbCA6tnWdBDa/bt3wTkWTh/P4sLFC4gfHYLZNuFYJhipEjkfZrWM1QdLaDQaeNx0sV2u4sSxLJjiTxFqRPhu5psxMv4tPgDeuQ1GwLMnMsgcG4KqRSApMrRwGDL5KYoiOM+F22oQHFinpJmk8pmhLEIRLfXSyLkF9nDe0NWwSptUyGS4TcdokRAULUzJIJ8cB/ApYNrouU7XW0bgfloTlhmazQ6tEyEqCpgNnV3/8qvRVF8Uqf4YFAqrtzeCeCYDUQ1RIigZVCIBkOMp01Q6giRDIsWe66NfVfF4j4CyAl6gimD2KNvvtPXiEwccbTqZTSNzNA2HE1Bc34QaCkPTVFIgwe7so7pdxnphA41KBTIpjlJUPHbhURQeVYMgsGFmeaCsUmIo4YlkHFp/P/nkYGlhERubJYw8dxKn9GGs3nuAP4xFFJsm0r0a9GezsEj98foeJFmGQGHDsjlG9WSITLgU1Joc1tA/kIJKZoqRGIXSwF7HgUuKm3v7SA4OIk2b+2I9SA8NwltZw3nHRyyZhO245C9nMNf1cm3fvtTY70BLJKFEogj3hPHiy3GcO/88zFaTuoMhEY8hwUQcOXO2247WXo3eC0gPj8Cl1oRLHw85nkrGCLoiKFKJFAohjerSgUxGR/viUKg7FFLfS1nlTBMhTaPeFtCu7cJkCgQSYFoWaru72FovGPzGVmWWpC7YlDWQxWQm6qUSZdYlqARqDArH6h7ICT4VeQd2u4VyaRscCWjtt7G5XsDN23cWrl2fnSUCwCT5cjBFZNLtlzewvbaK1bk52LRZjPZgt1JFrdZAT/oILMp27ckOao19yqYEsgzVeh3bT8qXA1YXmM8XDQr9/SiVSDRzFNUKhUOqHt661VUrmBZUj0eVlBSXl1Arl2nkSHQr4Mi/gcH0+OJysTvGur0ckO8/yk/wVhuOaV7lKZOxI2nMTH2L05kBZBIJcsCHRfWl0LSp1lrgklmywiML3PEPPr42GTCCqzttnv59+v39h2/r4b7ktGe2h1u2Rwq3kSaoawdDooMSTZo6F4aayi7QwZfHx6/8bcD+C3gAn/nsvTEenh4aGBzlRVWnVsBOIW8szhm5JiRj8uvZ2YO1h3//ArWa8OZmtQ4fAAAAAElFTkSuQmCCiVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAFKADAAQAAAABAAAAFAAAAACRFdLHAAAEp0lEQVQ4EXWUy28bVRTGv5m587LHTpzYjuPaTVvaIlraTCQqkIrUrJCQWGTFikX5CyBig1SkhhUSEhCExKILEgGiwCZBqAtggUtbCakKmahN2ygkcZw4blLbsR079rw54ypSeI08tmd07+9+5zsPDv9zvfP6K2P3Hjwa3mqaox3X08Hx4DjOEDiWU2RmGEv5H/5rK/fPlz//ekMv5f+cmv7kU71QrhOHgygwOJ4PIoLneTC6BUEw+sLSmzlj2TjM4A8//HTzxsRWYW3+848m9c1KHYoiBarARIFAAYyDQDskkUdI4nVVlubffeO1q4cZwsHDj7/MTPiue3X+1m/YWFkB6YEWUuB6HhhRiEsQETLBZCZAERlc30OsJzL66sUX6rm5xd8DVjfkGxSmb5vzpfwaZr6Ygui7SCTiSKaS2CyW0G536AAf2cEUJIHDVmkHhZ0qLNdFhtacOXUckhoauTI5bbCA6tnWdBDa/bt3wTkWTh/P4sLFC4gfHYLZNuFYJhipEjkfZrWM1QdLaDQaeNx0sV2u4sSxLJjiTxFqRPhu5psxMv4tPgDeuQ1GwLMnMsgcG4KqRSApMrRwGDL5KYoiOM+F22oQHFinpJmk8pmhLEIRLfXSyLkF9nDe0NWwSptUyGS4TcdokRAULUzJIJ8cB/ApYNrouU7XW0bgfloTlhmazQ6tEyEqCpgNnV3/8qvRVF8Uqf4YFAqrtzeCeCYDUQ1RIigZVCIBkOMp01Q6giRDIsWe66NfVfF4j4CyAl6gimD2KNvvtPXiEwccbTqZTSNzNA2HE1Bc34QaCkPTVFIgwe7so7pdxnphA41KBTIpjlJUPHbhURQeVYMgsGFmeaCsUmIo4YlkHFp/P/nkYGlhERubJYw8dxKn9GGs3nuAP4xFFJsm0r0a9GezsEj98foeJFmGQGHDsjlG9WSITLgU1Joc1tA/kIJKZoqRGIXSwF7HgUuKm3v7SA4OIk2b+2I9SA8NwltZw3nHRyyZhO245C9nMNf1cm3fvtTY70BLJKFEogj3hPHiy3GcO/88zFaTuoMhEY8hwUQcOXO2247WXo3eC0gPj8Cl1oRLHw85nkrGCLoiKFKJFAohjerSgUxGR/viUKg7FFLfS1nlTBMhTaPeFtCu7cJkCgQSYFoWaru72FovGPzGVmWWpC7YlDWQxWQm6qUSZdYlqARqDArH6h7ICT4VeQd2u4VyaRscCWjtt7G5XsDN23cWrl2fnSUCwCT5cjBFZNLtlzewvbaK1bk52LRZjPZgt1JFrdZAT/oILMp27ckOao19yqYEsgzVeh3bT8qXA1YXmM8XDQr9/SiVSDRzFNUKhUOqHt661VUrmBZUj0eVlBSXl1Arl2nkSHQr4Mi/gcH0+OJysTvGur0ckO8/yk/wVhuOaV7lKZOxI2nMTH2L05kBZBIJcsCHRfWl0LSp1lrgklmywiML3PEPPr42GTCCqzttnv59+v39h2/r4b7ktGe2h1u2Rwq3kSaoawdDooMSTZo6F4aayi7QwZfHx6/8bcD+C3gAn/nsvTEenh4aGBzlRVWnVsBOIW8szhm5JiRj8uvZ2YO1h3//ArWa8OZmtQ4fAAAAAElFTkSuQmCC';
//
// const mockItem = {
//   name: 'Place name',
//   place_id: '',
//   time: 20,
//   cost: 10,
//   employeeCount: 2,
//   children: [
//     {
//       name: 'Shift name',
//       shift_id: '',
//       time: 20,
//       cost: 10,
//       employeeCount: 2,
//       children: [
//         {
//           name: 'Barmens',
//           job_type_id: '',
//           time: 20,
//           cost: 10,
//           employeeCount: 2,
//           children: [
//             {
//               job_type_name: 'Job type name',
//               name: 'Employee name',
//               // avatar: photo,
//               employee_id: '',
//               time: 20,
//               cost: 10,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
// const dayOfWeek = [mockItem, mockItem, mockItem];

const trackYProps = {
  renderer: ({ elementRef, ...props }) => (
    <span
      {...props}
      ref={elementRef}
      className={classes.scrollbarTrackY}
    />
  ),
};

export default ({
  employeeCount,
  hours,
  money,
  photos,
  nested,
  title,
  empty,
  withCost,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const itemClasses = classNames(classes.item, {
    [classes.item_empty]: empty,
  });

  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);

  const handleClickOpenModal = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  if (empty) {
    return (
      <div className={classes.item}>
        <div className={classes.item__content}>
          <div className={classes.item__content__emptyIcon} />
          <div className={classes.item__content__noWorkers}>
            {t('No workers this day')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={itemClasses}>
      <button
        className={classes.item__content}
        onClick={handleClickOpenModal}
        ref={buttonRef}
      >
        <div className={classes.item__content__users}>
          {
            photos.map((photo) => photo && (
              <img
                key={photo}
                alt='avatar'
                className={classes.item__content__users__avatar}
                src={photo}
              />
            ))
          }
          <div className={classes.item__content__users__count}>
            {employeeCount}
          </div>
        </div>
        <div className={classes.item__content__statistic}>
          <div className={classes.item__content__statistic__hours}>
            {`${hours} ${t('hours')}`}
          </div>
          {
            withCost && (
              <div className={classes.item__content__statistic__money}>
                {`${money} USD`}
              </div>
            )
          }
        </div>
      </button>
      {
        isOpen && (
          <ClickAwayListener onClickAway={handleCloseModal}>
            <div className={classes.item__modal} ref={contentBoxRef}>
              <div className={classes.item__modal__title}>
                {title}
              </div>
              <CloseIcon
                className={classes.item__modal__close}
                onClick={handleCloseModal}
              />
              <Scrollbar
                className={classes.scrollableContent}
                noScrollX
                permanentTrackY
                trackYProps={trackYProps}
              >
                {
                  nested.map((item) => (
                    <ModalItem
                      key={item.jobTypeId}
                      title={item.name}
                      subTitle={item.job_type_name || `${item.employeeCount} employee`}
                      cost={item.cost}
                      time={item.time}
                      nested={item.children}
                      withCost={withCost}
                      main
                    />
                  ))
                }
              </Scrollbar>
            </div>
          </ClickAwayListener>
        )
      }
    </div>
  );
};
