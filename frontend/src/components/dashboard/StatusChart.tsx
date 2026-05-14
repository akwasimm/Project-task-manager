import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import type { StatusCount } from '../../types/dashboard.types'
import './StatusChart.css'

interface Props {
  data: StatusCount
}

const COLORS = {
  Todo:        '#9ca3af',
  'In Progress': '#3b82f6',
  Done:        '#22c55e',
  Overdue:     '#ef4444',
}

const StatusChart = ({ data }: Props) => {
  const chartData = [
    { name: 'Todo',        value: data.todo },
    { name: 'In Progress', value: data.in_progress },
    { name: 'Done',        value: data.done },
    { name: 'Overdue',     value: data.overdue },
  ].filter(d => d.value > 0)

  if (chartData.length === 0) {
    return (
      <div className='status-chart status-chart--empty'>
        <p>No task data yet</p>
      </div>
    )
  }

  return (
    <div className='status-chart'>
      <ResponsiveContainer width='100%' height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey='value'
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatusChart