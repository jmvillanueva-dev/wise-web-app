import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import ecFlag from "../../assets/ec-flag.svg";

const Footer = () => {
return (
    <footer className="footer">
    <div className="copyright">© 2023 Wise. Todos los derechos reservados.</div>
    <div className="location">
        <span>Ecuador </span> 
        <span className="flag">
            <img src={ecFlag} alt="Ecuador Flag" />
        </span>
    </div>
    <div className="social-links">
        <a href="#" aria-label="Instagram">
        <FaInstagram />
        </a>
        <a href="#" aria-label="Facebook">
        <FaFacebook />
        </a>
        <a href="#" aria-label="Twitter">
        <FaTwitter />
        </a>
        <a href="#" aria-label="LinkedIn">
        <FaLinkedin />
        </a>
        <a href="#" aria-label="YouTube">
        <FaYoutube />
        </a>
    </div>
    </footer>
)
}

export default Footer

