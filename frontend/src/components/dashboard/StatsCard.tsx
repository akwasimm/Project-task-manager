import './StatsCard.css'
import type { ReactNode } from 'react'

interface Props {
  title:  string
  value:  number
  icon:   ReactNode
  color:  'primary' | 'success' | 'warning' | 'danger'
  suffix?: string
}

const StatsCard = ({ title, value, icon, color, suffix }: Props) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className='stats-card__icon'>{icon}</div>
      <div className='stats-card__body'>
        <span className='stats-card__value'>
          {value}
          {suffix && <span className='stats-card__suffix'>{suffix}</span>}
        </span>
        <span className='stats-card__title'>{title}</span>
      </div>
    </div>
  )
}

export default StatsCard