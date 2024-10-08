import { Link } from "react-router-dom";

export default function Navigation() {

  const style = "list-group-item list-group-item-action";

  //list of main links
  const navItems = [
    { title:"Characters",to:"/characters" },
    { title:"Ships",to:"/ships" },
    { title:"Journey Guide", to:"/journey"},
    { title:"GAC", to:"/gac"},
    { title:"TW", to:"/tw"},
    { title:"RoTE", to:"/rote"},
    { title:"Tips", to:"/tips"},
    { title:"Admin", to:"/admin"},
  ]

  return (
    <div className="list-group list-group-flush">
      {navItems.map((navItem, index) => (
        <div key={"navItem_"+index} className={style}>
          <Link to={navItem.to} className="nav-link">{navItem.title}</Link>
        </div>
        ))
        }
    </div>
  )
}
