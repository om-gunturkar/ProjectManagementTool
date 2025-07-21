import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Clock, TrendingUp, Zap, Circle } from 'lucide-react'
import { Outlet } from 'react-router-dom';
import Axios from 'axios'

const Layout = ({ onLogout, user }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No auth token found");

      const { data } = await Axios.get("http://localhost:4000/api/tasks/gp", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const arr = Array.isArray(data) ? data :
        Array.isArray(data?.tasks) ? data.tasks :
          Array.isArray(data?.data) ? data.data : [];

      setTasks(arr);
    } catch (err) {
      console.log(err);
      setError(err.message || "Could not load tasks");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => { fetchTasks() }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t =>
      t.completed === true ||
      t.completed === 1 ||
      (typeof t.completed === "string" && t.completed.toLowerCase() === 'yes')
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount ?
      Math.round((completedTasks / totalCount) * 100) : 0;

    return {
      totalCount, completedTasks, pendingCount, completionPercentage
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className='p-3 rounded-xl bg-gray-700 shadow border border-blue-900 hover:shadow-lg transition-all group'>
      <div className='flex items-center gap-2'>
        <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-green-500/20 group-hover:from-blue-500/30 group-hover:to-green-500/30'>
          {icon}
        </div>
        <div className="min-w-0">
          <p className='text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent'>
            {value}
          </p>
          <p className='text-xs text-gray-400 font-medium'>{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <div className="bg-red-900 text-red-200 p-4 rounded-xl border border-red-700 max-w-md">
        <p className="font-medium mb-2">Error loading tasks</p>
        <p className="text-sm">{error}</p>
        <button onClick={fetchTasks} className='mt-4 py-2 px-4 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors'>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className='ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-4 transition-all duration-300'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
          <div className="xl:col-span-2 space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-4">
            <div className="bg-gray-800 rounded-xl p-5 shadow border border-blue-900">
              <h3 className='text-lg font-semibold mb-4 text-white flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-blue-400' />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatCard title='Total Tasks' value={stats.totalCount} icon={<Circle className='w-4 h-4 text-blue-400' />} />
                <StatCard title='Completed Tasks' value={stats.completedTasks} icon={<Circle className='w-4 h-4 text-green-400' />} />
                <StatCard title='Pending Tasks' value={stats.pendingCount} icon={<Circle className='w-4 h-4 text-orange-400' />} />
                <StatCard title='Completion Rate' value={`${stats.completionPercentage}%`} icon={<Zap className='w-4 h-4 text-blue-300' />} />
              </div>

              <hr className='my-4 border-blue-700' />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300">
                  <span className='text-sm font-medium flex items-center gap-1.5'>
                    <Circle className='w-3 h-3 text-blue-400 fill-blue-400' />
                    Task Progress
                  </span>
                  <span className='text-xs bg-blue-800 text-white px-2 py-0.5 rounded-full'>
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className='relative pt-1'>
                  <div className="h-3 bg-blue-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-green-500 transition-all duration-500"
                      style={{ width: `${stats.completionPercentage}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 shadow border border-blue-900">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Clock className='w-5 h-5 text-blue-400' />
                Recent Activity
              </h3>

              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task._id || task.id} className='flex items-center justify-between p-3 hover:bg-blue-800/50 rounded-lg transition'>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white break-words">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No Date"}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ml-2 ${task.completed ? 'bg-green-200 text-white' : 'bg-orange-600 text-white'}`}>
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-6 px-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-200 flex items-center justify-center">
                      <Clock className='w-8 h-8 text-blue-400' />
                    </div>
                    <p className='text-sm text-gray-400'>No Recent Activity</p>
                    <p className='text-xs text-gray-500 mt-1'>Tasks will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
