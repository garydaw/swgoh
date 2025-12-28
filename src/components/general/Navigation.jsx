import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";

export default function Navigation() {
  const {admin} = useAuth()
  //get the current url params
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const allyCode = searchParams.get('ally_code');
  const allyQueryParams = allyCode ? "?ally_code="+allyCode : "";

  const style = "list-group-item list-group-item-action";

  //list of main links
  const navItems = [
    { title: "Characters", to: "/characters" },
    { title: "Mods", to: "/mods" },
    { title: "Ships", to: "/ships" },
    { title: "Guild Units", to: "/guildunits" },
    { title: "Journey Guides", to: "/journey" },
    { title: "GAC", to: "/gac" },
    { title: "TW", to: "/tw" },
    { title: "TW Counters", to: "/twcounters" },
    { title: "RoTE", to: "/rote" },
    { title: "Relics", to: "/relics" }
  ]

  //add admin links for admins
  if(admin === 1){
    navItems.push({ title: "User Admin", to: "/userAdmin" });
    navItems.push({ title: "Team Admin", to: "/teamAdmin" });
    navItems.push({ title: "SWGOH Admin", to: "/swgohAdmin" });
  }

  return (
    <div className="list-group list-group-flush">
      {navItems.map((navItem, index) => (
        <div key={"navItem_"+index} className={style}>
          <Link to={navItem.to + allyQueryParams} className="nav-link">{navItem.title}</Link>
        </div>
        ))
        }
    </div>
  )
}
