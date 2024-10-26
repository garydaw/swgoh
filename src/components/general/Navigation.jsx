import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";

export default function Navigation() {
  const {admin} = useAuth()
  //get the current url params
  const location = useLocation();
  const currentQueryParams = location.search;

  const style = "list-group-item list-group-item-action";

  //list of main links
  const navItems = [
    { title: "Characters", to: "/characters" },
    { title: "Ships", to: "/ships" },
    { title: "Journey Guides", to: "/journey" },
    { title: "GAC", to: "/gac" },
    { title: "TW", to: "/tw" },
    { title: "RoTE", to: "/rote" },
    { title: "Tips", to: "/tips" }
  ]

  //add admin links for admins
  if(admin === 1){
    navItems.push({ title: "User Admin", to: "/userAdmin" });
  }

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
