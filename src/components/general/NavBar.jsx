import React from 'react'
import { Link } from 'react-router-dom'
import css from './NavBar.module.css'

export default function NavBar() {

  const navItems = [
    { title:"Units",to:"/units" },
    { title:"Ships",to:"/ships" },
    { title:"Journey Guide", to:"/journey"},
    { title:"GAC", to:"/gac"},
    { title:"TW", to:"/tw"},
    { title:"RoTE", to:"/rote"},
    { title:"Tips", to:"/tips"},
    { title:"Admin", to:"/admin"},
  ]
  return (
    <nav className={css.sidenav}>
        <ul>
            {navItems.map((navItem, index) => (
              <li key={"navItem_"+index}>
                <Link to={navItem.to}>{navItem.title}</Link>
              </li>
            ))
            }
        </ul>
    </nav>
  )
}
