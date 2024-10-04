import React from 'react'
import css from './Header.module.css'
import { useAuth } from '../store/useAuth'

export default function Header() {

  const {logout} = useAuth()
  return (
    <header>
        <h1>Header Bar</h1>
        <button onClick={logout}>Logout</button>
    </header>
  )
}
