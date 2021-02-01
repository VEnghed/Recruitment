import './header.css'

/**
 * An reusable header for all pages
 * Sends the user back to the start page on click
 */
function Header() {
    return (
        <header className="header">
            <h2 onClick={() => window.location='/'}>Recriutment</h2>
        </header>
        )
    }
    
export default Header;