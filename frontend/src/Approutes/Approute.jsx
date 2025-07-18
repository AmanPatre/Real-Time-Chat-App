import React from 'react'
import {BrowserRouter , Route , Routes} from 'react-router-dom'
import Landing from '../Screens/Landing'
import Signup from '../Screens/Signup'
import Home from '../Screens/Home'
import { ToastContainer } from 'react-toastify';
import Project from '../Screens/Project'
import { useState } from 'react'

const Approute = () => {



  return (
  <BrowserRouter>
  <Routes>
    
    <Route path='/' element={<Landing/>}></Route>
    <Route path='/signup' element={<Signup/>}></Route>
    <Route path='/home' element={<Home/>}></Route>
    <Route path='/project' element={<Project/>}></Route>

   
  </Routes>
  <ToastContainer/>
  </BrowserRouter>
  )
}

export default Approute
