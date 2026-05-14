import {
  FolderKanban, CheckSquare,
  AlertCircle, UserCheck
} from 'lucide-react'
import { useDashboard } from '../../hooks/useDashboard'
import StatsCard    from '../../components/dashboard/StatsCard'
import StatusChart  from '../../components/dashboard/StatusChart'
import StatusBadge  from '../../components/common/StatusBadge'
import PriorityBadge from '../../components/common/PriorityBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage  from '../../components/common/ErrorMessage'
import type { Task } from '../../types/task.types'
import './DashboardPage.css'

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className='flex-center' style={{ height: '60vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorMessage message='Failed to load dashboard data' />
  }

  return (
    <div className='dashboard'>

      {/* Overdue Alert */}
      {data.status_breakdown.overdue > 0 && (
        <div className='dashboard__alert'>
          <AlertCircle size={16} />
          <span>
            You have <strong>{data.status_breakdown.overdue}</strong> overdue
            {data.status_breakdown.overdue === 1 ? ' task' : ' tasks'}.
            Please review them.
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className='dashboard__stats'>
        <StatsCard
          title='Total Projects'
          value={data.total_projects}
          icon={<FolderKanban size={22} />}
          color='primary'
        />
        <StatsCard
          title='Total Tasks'
          value={data.total_tasks}
          icon={<CheckSquare size={22} />}
          color='success'
        />
        <StatsCard
          title='My Tasks'
          value={data.my_tasks}
          icon={<UserCheck size={22} />}
          color='warning'
        />
        <StatsCard
          title='Overdue Tasks'
          value={data.status_breakdown.overdue}
          icon={<AlertCircle size={22} />}
          color='danger'
        />
      </div>

      {/* Charts + Recent Tasks */}
      <div className='dashboard__grid'>

        {/* Status Chart */}
        <div className='card dashboard__chart'>
          <h2 className='dashboard__section-title'>Task Status Overview</h2>
          <StatusChart data={data.status_breakdown} />

          {/* Status breakdown numbers */}
          <div className='dashboard__breakdown'>
            <div className='dashboard__breakdown-item'>
              <span className='dashboard__breakdown-label'>To Do</span>
              <span className='dashboard__breakdown-value'>
                {data.status_breakdown.todo}
              </span>
            </div>
            <div className='dashboard__breakdown-item'>
              <span className='dashboard__breakdown-label'>In Progress</span>
              <span className='dashboard__breakdown-value'>
                {data.status_breakdown.in_progress}
              </span>
            </div>
            <div className='dashboard__breakdown-item'>
              <span className='dashboard__breakdown-label'>Done</span>
              <span className='dashboard__breakdown-value'>
                {data.status_breakdown.done}
              </span>
            </div>
            <div className='dashboard__breakdown-item'>
              <span className='dashboard__breakdown-label'>Overdue</span>
              <span
                className='dashboard__breakdown-value'
                style={{ color: 'var(--danger)' }}
              >
                {data.status_breakdown.overdue}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className='card dashboard__recent'>
          <h2 className='dashboard__section-title'>Recent Tasks</h2>
          {data.recent_tasks.length === 0 ? (
            <div className='dashboard__empty'>
              <p>No tasks yet</p>
            </div>
          ) : (
            <div className='dashboard__task-list'>
              {data.recent_tasks.map((task: Task) => (
                <div key={task.id} className='dashboard__task-item'>
                  <div className='dashboard__task-info'>
                    <span className='dashboard__task-title'>{task.title}</span>
                    <span className='dashboard__task-project'>
                      {task.project?.name}
                    </span>
                  </div>
                  <div className='dashboard__task-badges'>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge
                      status={task.is_overdue ? 'overdue' : task.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DashboardPage