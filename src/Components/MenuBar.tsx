
const fileDropdown = {}

export const MenuBar = () => {

    const handleFileButtonClick = () => {
        console.log(fileDropdown)
    }

    return (
        <div className="menu-bar">
            <button 
                id="file-btn" 
                className="menu-bar dropdown"
                onClick={handleFileButtonClick}
            >
                File
            </button>
            <button 
                id="edit-btn" 
                className="menu-bar dropdown"
            >
                Edit
            </button>
        </div>
    )
}