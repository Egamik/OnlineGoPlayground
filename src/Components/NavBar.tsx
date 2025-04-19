
export const NavBar = () => {

    const navItems = [
        {name: 'Home', icon: '', route: '/' },
        {name: 'Editor', icon: '', route: '/editor' },
        {name: 'DOM', icon: '', route: '/dom' }
    ]

    const handleButtonClick = (route: string) => {
        window.location.href = route
    }

    return (
        <aside>
            <div>
                { navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleButtonClick(item.route)}
                    >
                        {item.icon}
                        {item.name}
                    </button>
                )) }
            </div>
        </aside>
    )
}