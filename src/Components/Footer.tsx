import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faLandmark } from "@fortawesome/free-solid-svg-icons"

export const Footer = () => {

    const socialLinks = [
        {
            icon: <FontAwesomeIcon icon={faGithub} />,
            url: '',
            label: 'Github'
        },
        {
            icon: <FontAwesomeIcon icon={faLandmark} />,
            url: 'https://presencial.moodle.ufsc.br/course/view.php?id=22229&section=0',
            label: 'Moodle'
        }
    ]

    return (
        <footer>
            <div className="footer-content">
                <div className="social-links">
                    { socialLinks.map((item) => (
                        <a
                            href={item.url}
                            className="social-icon"
                        >
                            {item.icon}
                        </a>
                    ))
                    }
                </div>
                <div>
                    <p>Autor: Vitor K. Egami - 18200443</p>
                    <p>OnlineGoPlayground</p>
                </div>
            </div>
        </footer>
    )
}