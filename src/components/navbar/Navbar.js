'use client';

import React, { useState } from 'react';
import { IoMdCart } from 'react-icons/io';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { ButtonOne } from '../reusables/buttons/Buttons';
import { Search, SearchTwo } from '../inputs/SearchInputs';
import Modal from '../Modal/Modal';
import { Textinput } from '../inputs/Textinput';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState(null); // Determines which modal to show
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const nav = useRouter()
  const [cat] = useState([
    'All Categories',
    'Tees',
    'Beanies',
  ]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = (type) => {
    setModalType(type); // Set the type of modal to display
    setModal(true); // Open modal
  };

  const closeModal = () => {
    setModal(false); // Close modal
    setModalType(null); // Reset modal type
  };

  const loginForm = async (e) => {
    e.preventDefault();
  };
  const SignUpForm = async (e) => {
    e.preventDefault();
  };
  const ForgottenPasswordForm = async (e) => {
    e.preventDefault();
  };
  const AdminForm = async (e) => {
    e.preventDefault();
    nav.push('/admin')

  };

  return (
    <>
      <nav className="fixed top-0 w-full py-5 flex items-center justify-center backdrop-blur-lg">
        <div className="w-[80%] mx-auto hidden md:flex flex-row items-center justify-between">
          <section className="flex flex-row justify-evenly gap-x-5">
            <span onClick={()=>openModal('admin')} className='cursor-pointer'>Logo</span>
            <span>All</span>
            <span>Tees</span>
            <span>Beanies</span>
          </section>
          <section className="flex flex-row justify-evenly items-center gap-x-5">
            <span><SearchTwo /></span>
            <span onClick={() => openModal('login')} className="cursor-pointer"><User /></span>
            <span><ShoppingBag /></span>
          </section>
        </div>
        <div className="w-[80%] mx-auto flex md:hidden flex-row items-center justify-between relative">
        <span onClick={()=>openModal('admin')} className='cursor-pointer'>Logo</span>
        <span onClick={toggleDropdown} className="cursor-pointer">
            {isDropdownOpen ? <X /> : <Menu />}
          </span>
        </div>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full bg-white text-customGray border-t shadow-lg md:hidden">
            <div className="flex flex-col px-5 py-4">
              <span className="cursor-pointer py-2"><Search category={cat} /></span>
              <hr className="my-2" />
              <span className="cursor-pointer py-2 flex items-center gap-x-2" onClick={() => openModal('login')}>
                <User /> Profile
              </span>
              <span className="cursor-pointer py-2 flex items-center gap-x-2">
                <ShoppingBag /> Cart
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* Single Modal for Login, SignUp, and Forgot Password */}
      <Modal
        title={modalType === 'login' ? 'Login' : modalType === 'signup' ? 'Sign Up' : modalType === 'forgotPassword'?  'Forgot Password?' : 'admin Login' }
        isOpen={modal}
        onClose={closeModal}
        onSubmit={
          modalType === 'login' ? loginForm : modalType === 'signup' ? SignUpForm : modalType === 'forgotPassword'?  ForgottenPasswordForm : AdminForm
        }
        buttonValue={modalType === 'login' ? 'Login' : modalType === 'signup' ? 'Sign Up' : 'Submit'}
        subChildren={
          modalType === 'login' ? (
            <span className="text-center gap-x-2 items-center justify-center flex text-sm">
              <p>Don't have an account?</p>
              <span className="text-blue-600 cursor-pointer" onClick={() => openModal('signup')}>
                Sign up
              </span>
            </span>
          ) : modalType === 'signup' ? (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Already have an account?</p>
              <span className="text-blue-600 cursor-pointer" onClick={() => openModal('login')}>
                Log in
              </span>
            </span>
          ) : modalType === 'admin'? '' 
          :  (
            <span className="w-full justify-center items-center text-sm flex gap-x-2">
              <p>Remember your password?</p>
              <span className="text-blue-600 cursor-pointer" onClick={() => openModal('login')}>
                Log in
              </span>
            </span>
          )
        }
      >
        {modalType === 'login' && (
          <>
            <Textinput
              label="Email"
              className="border-b"
              type="email"
              value={loginEmail}
              changed={(e) => setLoginEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              className="border-b my-5"
              type="password"
              value={loginPassword}
              changed={(e) => setLoginPassword(e.target.value)}
            />
            <span className="w-full flex justify-between text-blue-600 text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-blue-600"
                />
                <label htmlFor="rememberMe" className="ml-2 text-black">Remember Me</label>
              </div>
              <span onClick={() => openModal('forgotPassword')} className="cursor-pointer">
                Forgot password?
              </span>
            </span>
          </>
        )}

{modalType === 'admin' && (
          <>
            <Textinput
              label="Email"
              className="border-b"
              type="email"
              value={adminEmail}
              changed={(e) => setAdminEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              className="border-b my-5"
              type="password"
              value={adminPassword}
              changed={(e) => setAdminPassword(e.target.value)}
            />
            <span className="w-full flex justify-between text-blue-600 text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-blue-600"
                />
                <label htmlFor="rememberMe" className="ml-2 text-black">Remember Me</label>
              </div>
            </span>
          </>
        )}

        {modalType === 'signup' && (
          <>
            <Textinput
              label="First Name"
              className="border-b my-5"
              type="text"
              value={firstName}
              changed={(e) => setFirstName(e.target.value)}
            />
            <Textinput
              label="Last Name"
              className="border-b my-5"
              type="text"
              value={lastName}
              changed={(e) => setLastName(e.target.value)}
            />
            <Textinput
              label="Email"
              className="border-b my-5"
              type="email"
              value={signUpEmail}
              changed={(e) => setSignUpEmail(e.target.value)}
            />
            <Textinput
              label="Password"
              className="border-b my-5"
              type="password"
              value={signUpPassword}
              changed={(e) => setSignUpPassword(e.target.value)}
            />
          </>
        )}

        {modalType === 'forgotPassword' && (
          <>
            <p>Please enter your email</p>
            <Textinput
              label="Email"
              className="border-b my-5"
              type="email"
              value={forgotPasswordEmail}
              changed={(e) => setForgotPasswordEmail(e.target.value)}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default Navbar;
