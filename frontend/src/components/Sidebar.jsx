import React, { useEffect, useState } from 'react'
import { LINK_CLASSES, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, menuItems, TIP_CARD } from '../assets/dummy'
import { NavLink } from 'react-router-dom';
import { Lightbulb, Menu, Sparkles, X } from 'lucide-react'

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showModel, setShowModel] = useState(false)

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.completed).length || 0
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const username = user?.name || 'User'
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [mobileOpen])

  const renderMenuItems = (isMobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) => [
              LINK_CLASSES.base,
              isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
              isMobile ? "justify-start" : "lg:justify-center"
            ].join(" ")}
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>
              {icon}
            </span>
            <span className={`${isMobile ? "block" : "hidden lg:block"} ${LINK_CLASSES.text}`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className="p-1 m-3 border-b border-blue-300 lg:block hidden">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 m-2 rounded-full bg-gradient-to-br from-[#1FA2FF] via-[#4dc2d7] to-[#A6FFCB] flex items-center justify-center text-white font-bold shadow-md">
              {initial}
            </div>
            <div>
              <h2 className='text-lg font-bold text-[#f8f8f8]'>Heyy, {username}</h2>
              <p className='text-sm text-[#49cedd] font-medium flex items-center gap-1 '>
                <Sparkles className='w-3 h-4 ' /> Lets Crush Some Tasks!
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div className={PRODUCTIVITY_CARD.barFg} style={{ width: `${productivity}%` }} />
            </div>
          </div>

          {renderMenuItems()}
          <div className="mt-auto pt-6 lg:block hidden">
            <div className={TIP_CARD.container}>
              <div className='flex items-center gap-2'>
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-[#1FA2FF]" />
                </div>
                <div>
                  <h3 className={TIP_CARD.title}>Tip of the Day</h3>
                  <p className={TIP_CARD.text}>Stay focused and take breaks to boost your productivity!</p>
                  <a href="https://omgunturkar.me/" target='_blank' className='block mt-2 text-sm text-[#1FA2FF] hover:underline'>
                    Visit My personal website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {!mobileOpen && (
        <button className={SIDEBAR_CLASSES.mobileButton} onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div className={SIDEBAR_CLASSES.mobileDrawerBackdrop} onClick={() => setMobileOpen(false)}>
            <div className={SIDEBAR_CLASSES.mobileDrawer} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className='text-lg font-bold text-[#1FA2FF]'>Menu</h2>
                <button className="text-gray-700 hover:text-[#1FA2FF]" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-6 ">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] flex items-center justify-center text-white font-bold shadow-md">
                  {initial}
                </div>
                <div>
                  <h2 className='text-lg font-bold mt-16 text-[#2B2B2B]'>Heyy, {username}</h2>
                  <p className='text-sm text-[#1FA2FF] font-medium flex items-center gap-1'>
                    <Sparkles className='w-3 h-4' /> Lets Crush Some Tasks!
                  </p>
                </div>
              </div>
              {renderMenuItems(true)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
