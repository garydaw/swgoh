import { Link, useLocation } from "react-router-dom";

export default function Navigation() {

  //get the current url params
  const location = useLocation();
  const currentQueryParams = location.search;

  const style = "list-group-item list-group-item-action";

  //list of main links
  const navItems = [
    { title: "Characters", to: "/characters" },
    { title: "Ships", to: "/ships" },
    { title: "Journey Guide", to: "/journey" },
    { title: "GAC", to: "/gac" },
    { title: "TW", to: "/tw" },
    { title: "RoTE", to: "/rote" },
    { title: "Tips", to: "/tips" },
    { title: "Admin", to: "/admin" },
  ]

  return (
    <div className="list-group list-group-flush">
      {navItems.map((navItem, index) => (
        <div key={"navItem_"+index} className={style}>
          <Link to={navItem.to + currentQueryParams} className="nav-link">{navItem.title}</Link>
        </div>
        ))
        }
    </div>
  )
}
