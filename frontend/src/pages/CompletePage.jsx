import React, { useState, useMemo } from 'react';
import { CT_CLASSES, layoutClasses, SORT_OPTIONS } from '../assets/dummy';
import { CheckCircle2, Filter } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';

const CompletePage = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        [true, 1, 'yes'].includes(
          typeof task.completed === 'string'
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'priority': {
            const order = { high: 3, medium: 2, low: 1 };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className={CT_CLASSES.page}>
      {/* Header */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className='text-green-500 w-5 h-5 md:w-6 md:h-6' />
            <span className='truncate bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent'>
              Completed Tasks
            </span>
          </h1>
          <p className='text-sm text-gray-500'>
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && 's'} marked as completed
          </p>
        </div>

        {/* Sort Controls */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={layoutClasses.sortBox}>
            {/* Label */}
            <div className='flex items-center gap-2 text-gray-700 font-medium'>
              <Filter className='w-4 h-4 text-blue-500' />
              <span className='text-sm'>Sort By :</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`block md:hidden ${layoutClasses.select}`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>

            {/* Desktop Buttons */}
            <div className={`hidden md:flex ${layoutClasses.tabWrapper}`}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={layoutClasses.tabButton(sortBy === opt.id)}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Task List */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className='w-6 h-6 md:w-8 text-blue-500' />
            </div>
            <h3 className='text-lg font-semibold text-gray-500'>
              No Completed Tasks Yet!
            </h3>
            <p className='text-gray-300 text-sm'>
              Complete some tasks and they will appear here.
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className='opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base'
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletePage;
