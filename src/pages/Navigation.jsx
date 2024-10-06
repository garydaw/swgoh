import { Link } from "react-router-dom";

export default function Navigation() {

  const style = "list-group-item list-group-item-action";
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
    <div className="list-group list-group-flush">
      {navItems.map((navItem, index) => (
        <div key={"navItem_"+index}className={style}>
          <Link to={navItem.to} className="nav-link">{navItem.title}</Link>
        </div>
        ))
        }
    </div>
  )
  return (

    <div className="list-group list-group-flush">
      <div className={style}><Link to={`units`} className="nav-link">Units</Link></div>
      <div className={style}><Link to={`ships`} className="nav-link">Ships</Link></div>
      <div className={style}><Link to={`tw`} className="nav-link">Wars</Link></div>
      <div className={style}><Link to={`tw/war`} className="nav-link ms-3">War</Link></div>
      <div className={style}><Link to={`tw/admin`} className="nav-link ms-3">admin</Link></div>
    </div>
  );
}
