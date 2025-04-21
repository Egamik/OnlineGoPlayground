import { NavLink } from "react-router"

export const NavBar = () => {

    const navItems = [
        {name: 'Home', icon: '', route: '/' },
        {name: 'Editor', icon: '', route: '/editor' },
        {name: 'DOM', icon: '', route: '/dom' }
    ]

    return (
        <div className="navbar">
            <div className="navbar-logo-container">
                <img src="text.png" alt="Logo" className="navbar-logo"/>
            </div>
            <div className="side-navbar">
                <nav>
                    { navItems.map((item) => (
                        <NavLink
                            to={item.route}
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                        >
                            {item.name}
                        </NavLink>
                    )) }
                </nav>
            </div>
        </div>
    )
}