import { NavLink } from "react-router-dom"

export const NavBar = () => {

    const navItems = [
        {name: 'Home', icon: '', route: '/' },
        {name: 'Editor', icon: '', route: '/editor' },
        {name: 'DOM', icon: '', route: '/dom' }
    ]

    return (
        <aside>
            <div className="side-navbar">
                { navItems.map((item) => (
                    <NavLink
                        to={item.route}
                        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                    >
                        {item.name}
                    </NavLink>
                )) }
            </div>
        </aside>
    )
}