export const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>
                Golang playground!
            </p>
            <div className="home-text-container">
                <h3>Sobre o projeto</h3>
                <div className="home-text-content">
                    <p>
                        Editor e compilador online para linguagem de programação Golang desenvolvido para a disciplina INE5646 - Programação Web. 
                        Este projeto foi desenvolvido em Abril de 2025 e está disponível via AWS.
                    </p>
                </div>
            </div>
            <div className="home-text-container">
                <h3>Tecnologias utilizadas</h3>
                <div className="home-text-content">
                    <ul>
                        <li>React</li>
                        <li>NodeJS</li>
                        <li>Docker</li>
                        <li>AWS</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}