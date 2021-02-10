import './header.css'
import { Link } from 'react-router-dom'

/**
 * An reusable header for all pages,
 * Sends the user back to the start page on click
 * @returns the header component
 */
function Header() {
    return (
        <header className="header">
            <h2 onClick={() => window.location = '/'}>Recruitment</h2>
        </header>
    )
}

export default Header;