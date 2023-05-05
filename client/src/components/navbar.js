import "./navbar.css"
import Logo from "./../CityGuesser.svg"

const Navbar = () => {
    return (
        <div className="navbar">
            <img src={Logo} id="logo" alt="logo" />
            <ul>
                <li><a href="">Home</a></li>
                <li><a href="">About</a></li>
            </ul>
        </div>
    );
};

export default Navbar;