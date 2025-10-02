import React from 'react'
import styles from './styles.module.scss'

import TimeOffSymbol1 from '../../Icons/TimeOffSymbol1'
import TimeOffSymbol2 from '../../Icons/TimeOffSymbol2'
import TimeOffSymbol3 from '../../Icons/TimeOffSymbol3'
import TimeOffSymbol4 from '../../Icons/TimeOffSymbol4'
import TimeOffSymbol5 from '../../Icons/TimeOffSymbol5'
import TimeOffSymbol6 from '../../Icons/TimeOffSymbol6'
import TimeOffSymbol7 from '../../Icons/TimeOffSymbol7'
import TimeOffSymbol8 from '../../Icons/TimeOffSymbol8'
import TimeOffSymbol9 from '../../Icons/TimeOffSymbol9'

const PolicySymbol = ({symbol, color}) => {
  return (
    <span className={styles.symbol} style={{backgroundColor: color}}>
      {
        ((symbol) => {
          switch (symbol) {
            case '1': return <TimeOffSymbol1 />
            case '2': return <TimeOffSymbol2 />
            case '3': return <TimeOffSymbol3 />
            case '4': return <TimeOffSymbol4 />
            case '5': return <TimeOffSymbol5 />
            case '6': return <TimeOffSymbol6 />
            case '7': return <TimeOffSymbol7 />
            case '8': return <TimeOffSymbol8 />
            case '9': return <TimeOffSymbol9 />
            default:
              return null
          }
        })(symbol)
      }
    </span>
  )
}

export default PolicySymbol
