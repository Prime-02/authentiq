'use client'
import { useGlobalState } from '@/app/GlobalStateProvider'
import { adminDBSidebar } from '@/components/index'
import { SearchTwo } from '@/components/inputs/SearchInputs'
import Modal from '@/components/Modal/Modal'
import { ButtonOne, ButtonTwo } from '@/components/reusables/buttons/Buttons'
import { Home, LogOutIcon, User, User2Icon, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { RiSideBarLine } from 'react-icons/ri'


const Sidebar = () => {
  const [sideSlide, setSideSlide] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const pathname = usePathname()

  const formattedPath = pathname.replace(/\//g, ' > ').replace(/^ > /, '')
  const fullName = ''
  const { formData } = useGlobalState();  // Access global state
  const adminFullName = formData.adminFullName ? formData.adminFullName : 'admin'; // Extract adminFullName from formData

  // Replace spaces with hyphens in the adminFullName
  const formattedAdminFullName = adminFullName.replace(/\s+/g, '_');


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSideSlide(true)
      } else {
        setSideSlide(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleSideSlide = () => {
    setSideSlide(prevState => !prevState)
  }

  const handleLinkClick = (href) => {
    setActiveLink(href)
    setSideSlide(false)
  }

  const closeSideBar = () => {
    if (window.innerWidth < 768) {
      setSideSlide(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const LogoutUser = () => {
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    setShowLogoutModal(false)
  }

  return (
    <>
      {sideSlide && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={closeSideBar}
        ></div>
      )}

      <aside className={`fixed top-0 h-screen w-1/2 sm:w-auto transition-transform duration-300 px-2 bg-gray-800 z-50 ${sideSlide ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
        <div className='flex flex-col h-full text-white pt-12'>
          <div className="h-16 flex items-center sm:items-start gap-1 px-4 pb-2 overflow-hidden ">
          <span className='p-2 border-gray-400 border-2 rounded-full'>
              <Home size={20} />
            </span>
          </div>

          <div className='flex flex-col gap-y-2 sm:items-center items-start overflow-y-auto'>
            {adminDBSidebar.map((links, index) => {
            const updatedHref = links.href.replace('/name', `/${formattedAdminFullName}`);
              return  (
                <div className='border-gray-700 my-4' key={index}>
                  <Link
                    href={updatedHref}
                    onClick={() => handleLinkClick(links.href)}
                    className={`flex items-center mx-auto gap-2 py-2 hover:text-gray-400 text-base sm:text-lg focus:bg-white focus:text-slate-800 px-3 rounded-xl mr-3 transition duration-200 ${activeLink === links.href ? 'bg-gray-700 text-gray-200' : ''}`}
                  >
                    <span className='text-xl'>{links.icons}</span>
                    <span className='sm:hidden'>{links.name}</span>
                  </Link>
                </div>
              )
            }
            )}
            <div className='border-gray-700'>
              <button
                onClick={handleLogoutClick}
                className="flex items-center mx-auto gap-2 py-1 text-sm sm:text-base hover:text-gray-400 px-3 rounded-xl mr-3 transition duration-200"
              >
                <span className='text-xl'>
                  <LogOutIcon />
                </span>
                <span className='sm:hidden'>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <nav className='fixed top-0 w-full backdrop-blur-3xl border-b'>
        <div className='flex px-5 py-4 items-center justify-between w-full gap-x-10 sm:gap-x-[10%]'>

          <div className='w-3/2 md:w-1/2 flex justify-start gap-x-16 items-center'>
            <span className='p-2 border-gray-400 border-2 rounded-lg flex' onClick={toggleSideSlide}>
              <RiSideBarLine size={20} />
            </span>
            <span className='w-1/2 hidden md:flex'>
              {formattedPath}
            </span>
          </div>

          <div className='w-full md:w-1/3 flex justify-between md:justify-center gap-x-4 items-center'>
            <span className=''>
              <SearchTwo />
            </span>
            <span className="text-3xl border-2 border-gray-400 rounded-full h-12 w-12 flex items-center justify-center">
              {fullName ? <strong>{fullName.charAt(0).toUpperCase()}</strong> : <UserCircle />}
            </span>
          </div>
        </div>
      </nav>
      
      {showLogoutModal && (
        <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-lg font-bold mb-4 text-center text-slate-800">
              Are you sure you want to log out?
            </h1>
            <div className="flex gap-4">
              <ButtonOne Clicked={() => setShowLogoutModal(false)} buttonValue="No" />
              <Link href="/">
                <ButtonTwo Clicked={() => setShowLogoutModal(false)} buttonValue="Yes" />
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Sidebar
