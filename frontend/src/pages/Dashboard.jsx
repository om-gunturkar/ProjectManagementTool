import React, { useState, useMemo, useCallback } from 'react'
import { ADD_BUTTON, EMPTY_STATE, FILTER_LABELS, FILTER_OPTIONS, FILTER_WRAPPER, HEADER, ICON_WRAPPER, LABEL_CLASS, SELECT_CLASSES, STAT_CARD, STATS, STATS_GRID, TAB_ACTIVE, TAB_BASE, TAB_INACTIVE, TABS_WRAPPER, VALUE_CLASS, WRAPPER } from '../assets/dummy'
import { HomeIcon, Plus, Icon, Filter, Calendar } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import TaskItem from '../components/TaskItem'
import axios from 'axios'
import TaskModal from '../components/TaskModal'

const API_BASE = 'http://localhost:4000/api/tasks'

const Dashboard = () => {

  const { tasks, refreshTasks } = useOutletContext()
  const [showModal, setShowModal] = useState(false)
  const [selectedTasks, setSelectTask] = useState(null)
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
    highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
    completed: tasks.filter(t => t.completed === true || t.completed === 1 || (
      typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes'
    )).length
  }), [tasks]);

  
  //FILTER TASKS
  const filteredTasks = useMemo(() => tasks.filter(task => {
    const dueDate = new Date(task.DueDate);
    const today = new Date();
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
    switch (filter) {
      case 'today':
        return dueDate.toDateString() === today.toDateString();

      case 'week':
        return dueDate >= today && dueDate <= nextWeek;

      case "high":
      case "medium":
      case "low":
        return task.priority?.toLowerCase() === filter;

      default:
        return true; // 'all' or any other case, return all tasks
    }
  }), [tasks, filter]);

  //Saving Tasks
  const handleTaskSave = useCallback(async (taskData) => {
    try {
      if (taskData.id) await axios.put(`${API_BASE}/${taskData.id}/gp`, taskData);
      refreshTasks();
      setShowModal(false);
      setSelectTask(null);

    } catch (error) {
      console.log("Error saving task : ", error)

    }
  }, [refreshTasks]);

  return (
    <div className="bg-[#0f172a] min-h-screen px-4 py-6 md:px-8 md:py-5 text-white">
      {/* Header */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className='text-xl md:text-3xl font-bold text-white flex items-center gap-2'>
            <HomeIcon className='w-7 h-7 mt-1 mr-2 md:w-6 md:h-6 shrink-0 text-purple-400' />
            <span className='truncate bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent'>Task Overview</span>
          </h1>
          <p className='text-sm text-gray-300 mt-1 ml-7 truncate'>Manage Your Tasks Efficiently</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-lg flex items-center gap-1 transition">
          <Plus size={18} /> Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className={STATS_GRID}>
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = "border-red-600", valueKey, textColor, gradient }) => (
          <div key={key} className={`${STAT_CARD} bg-slate-800 border ${borderColor}`}>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className='w-4 h-4 md:w-5 md:h-5' />
              </div>

              <div className="min-w-0">
                <p className={`${VALUE_CLASS} ${gradient ?
                  "bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent" : textColor}`}>{stats[valueKey]}
                </p>
                <p className="text-gray-300 text-sm">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contents  */}
      <div className="space-y-6">
        {/* FILTER */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-h-0">
            <Filter className='w-5 h-5 text-blue-400 shrink-0' />
            <h2 className='text-base md:text-lg font-semibold text-white truncate'>
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={SELECT_CLASSES}>
            {FILTER_OPTIONS.map(opt => <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>)}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>

        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center bg-slate-800 p-6 rounded-xl">
              <div className="flex justify-center">
                <div className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className='text-lg font-semibold mb-2 text-white'>
                No Tasks Found
              </h3>
              <p className='text-sm text-gray-300 mb-4'>{filter === "all" ? "Create your first tasks to get started" : "No task"}</p>
              <button onClick={() => setShowModal(true)} className="bg-blue-500  cursor-pointer hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* ADD Task Desktop */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 bg-slate-800 cursor-pointer transition-colors">
          <Plus className='w-5 h-5 text-blue-400 mr-2' />
          <span className='text-white font-medium'>Add New Tasks</span>
        </div>
      </div>

      {/* MODAL */}
      <TaskModal isOpen={showModal || !!selectedTasks}
        onClose={() => {
          setShowModal(false);
          setSelectTask(null);
        }}
        taskToEdit={selectedTasks}
        onSave={handleTaskSave} />

    </div>
  )
}

export default Dashboard
