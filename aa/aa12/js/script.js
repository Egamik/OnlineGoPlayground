window.onload = () => {
    mostrarApenasHome()
    configurarLogin()
    configurarCriarConta()
}

function mostrarApenasHome() {
    document.getElementById("divHome").style.display = "block"
    document.getElementById("login-body").style.display = "none"
    document.getElementById("nova-conta").style.display = "none"
}

function mostrarApenasLogin() {
    document.getElementById("divHome").style.display = "none"
    document.getElementById("nova-conta").style.display = "none"

    const loginDiv = document.getElementById("login-body")
    loginDiv.style.display = "block"

    const [email, senha] = loginDiv.querySelectorAll("input[type=text], input[type=password]")
    email.value = ""
    senha.value = ""

    document.getElementById("botaoLogin").disabled = true

    email.oninput = senha.oninput = () => {
        const temEmail = email.value.includes("@") && email.value.split("@").length === 2
        const temSenha = senha.value.trim().length > 0
        document.getElementById("botaoLogin").disabled = !(temEmail && temSenha)
    }

    senha.onblur = () => senha.type = "password"
}
  
function mostrarApenasConta() {
    document.getElementById("divHome").style.display = "none"
    document.getElementById("login-body").style.display = "none"
    document.getElementById("nova-conta").style.display = "block"

    const form = document.querySelector("#nova-conta form")
    form.reset()
    form.querySelectorAll("p").forEach(p => p.innerHTML = "")

    configurarCriarConta()
}
  
function configurarLogin() {
    const emailInput = document.getElementById("login-email")
    const senhaInput = document.getElementById("login-password")

    emailInput.value = ""
    senhaInput.value = ""

    const botaoLogin = document.getElementById("botaoLogin")
    botaoLogin.disabled = true

    function validarCampos() {
        const emailValido = emailInput.value.includes("@") && emailInput.value.split("@").length === 2
        const senhaPresente = senhaInput.value.trim().length > 0
        botaoLogin.disabled = !(emailValido && senhaPresente)
        return emailValido && senhaPresente
    }
    
    emailInput.addEventListener("input", validarCampos)
    senhaInput.addEventListener("input", validarCampos)

    botaoLogin.onclick = (e) => {
        e.preventDefault()
        
        const email = emailInput.value.trim()
        const senha = senhaInput.value.trim()
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || [])
        const usuario = usuarios.find(u => u.email === email && u.senha === senha)

        if (usuario) {
            document.getElementById("localidade").style.display = "block"
            configurarLocalidade()
            alert('Usuário logado')
        } else {
            alert("Email ou senha incorretos")
        }
    }
}
  
function configurarCriarConta() {
    const form = document.querySelector("#nova-conta form")
    const nome = form.elements[0]
    const sobrenome = form.elements[1]
    const cpf = form.elements[2]
    const email = form.elements[3]
    const senha = form.elements[4]
    const repetir = form.elements[5]
    const cep = form.elements[6]
    console.log('form elements: ', form.elements)
    const botao = form.querySelector("input[type=button]")

    function validarTudo() {
        try {
            const campos = [nome, sobrenome, email, senha, repetir, cep]
            const validos = campos.every(c => c.value.trim() !== "")
            const emailValido = email.value.includes("@") && email.value.split("@").length === 2
            const senhasIguais = senha.value === repetir.value
            const cpfValido = validarCPF(cpf)
            return validos && emailValido && senhasIguais && cpfValido
        } catch (e) {
            atualizarStatus("statusCPF", e.message, "red")
            return false
        }
    }

    botao.onclick = () => {
        if (validarTudo()) {
            const usuario = {
                nome: nome.value.trim(),
                sobrenome: sobrenome.value.trim(),
                cpf: cpf.value.trim(),
                email: email.value.trim(),
                senha: senha.value.trim(),
                cep: cep.value.trim()
            }
            const store = JSON.parse(localStorage.getItem("usuarios") || '[]')
            store.push(usuario)
            localStorage.setItem("usuarios", JSON.stringify(store))
            alert("Conta criada com sucesso!")
            mostrarApenasLogin()
        }
    }

    email.onblur = () => {
        const status = email.value.includes("@") && email.value.split("@").length === 2
            ? { msg: "OK", color: "green" }
            : { msg: "E-mail inválido", color: "red" }
        atualizarStatus("statusEmail", status.msg, status.color)
    }

    senha.oninput = repetir.oninput = () => {
        if (senha.value && senha.value === repetir.value) {
            atualizarStatus("statusSenha", "OK", "green")
            atualizarStatus("statusRepitaSenha", "OK", "green")
        } else {
            atualizarStatus("statusRepitaSenha", "Senhas não coincidem", "red")
        }
    }
}
  
function validaTextoEmBranco(input, idStatus, nomeCampo) {
    const msg = input.value.trim() === "" ? `${nomeCampo} não pode estar vazio` : "OK"
    const color = msg === "OK" ? "green" : "red"
    atualizarStatus(idStatus, msg, color)
}
  
function atualizarStatus(id, msg, color) {
    const p = document.getElementById(id)
    p.textContent = msg
    p.style.color = color
}
  
function validarCPF(input) {
    const status = document.getElementById("statusCPF")
    const cpf = input.value.replace(/\D/g, "")
  
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        status.textContent = "CPF inválido"
        status.style.color = "red"
        return
    }
  
    const calcDigito = (base, peso) => {
        const soma = base.reduce((acc, num, idx) => acc + num * (peso - idx), 0)
        const resto = (soma * 10) % 11
        return resto === 10 ? 0 : resto
    }
  
    const nums = cpf.split("").map(Number)
    const d1 = calcDigito(nums.slice(0, 9), 10)
    const d2 = calcDigito(nums.slice(0, 10), 11)
  
    if (d1 !== nums[9] || d2 !== nums[10]) {
        status.textContent = "CPF inválido"
        status.style.color = "red"
        return false
    } else {
        status.textContent = "OK"
        status.style.color = "green"
        return true
    }
}


function buscarEnderecoPorCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "")
    const status = document.getElementById("statusCep")
  
    if (cepLimpo.length !== 8) {
      status.textContent = "CEP inválido"
      status.style.color = "red"
      limparCamposEndereco()
      return
    }
  
    status.textContent = "Buscando endereço..."
    status.style.color = "black"
  
    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(res => res.json())
        .then(data => {
                if (data.erro) {
                status.textContent = "CEP não encontrado"
                status.style.color = "red"
                limparCamposEndereco()
            } else {
                document.getElementById("logradouro").value = data.logradouro || ""
                document.getElementById("bairro").value = data.bairro || ""
                document.getElementById("municipio").value = data.localidade || ""
                document.getElementById("estado").value = data.uf || ""
        
                status.textContent = "OK"
                status.style.color = "green"
            }
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error)
            status.textContent = "Erro ao buscar CEP"
            status.style.color = "red"
            limparCamposEndereco()
        })
}
  
function limparCamposEndereco() {
    document.getElementById("logradouro").value = ""
    document.getElementById("bairro").value = ""
    document.getElementById("municipio").value = ""
    document.getElementById("estado").value = ""
}

function configurarLocalidade() {
    const ufSelect = document.getElementById("ufSelect")
    const municipioSelect = document.getElementById("municipioSelect")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then(res => res.json()).then(estados => {
            estados.forEach(uf => {
                const option = document.createElement("option")
                option.value = uf.id
                option.textContent = uf.nome
                ufSelect.appendChild(option)
        })
    })

    ufSelect.addEventListener("change", () => {
        const ufId = ufSelect.value
        municipioSelect.innerHTML = "<option>Carregando municípios...</option>"
        municipioSelect.disabled = true
    
        if (!ufId) {
            municipioSelect.innerHTML = "<option>Selecione uma UF primeiro</option>"
            return
        }
        
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios?orderBy=nome`)
            .then(res => res.json())
            .then(municipios => {
                municipioSelect.innerHTML = "<option value=''>Selecione um município</option>"
                municipios.forEach(m => {
                    const option = document.createElement("option")
                    option.value = m.id
                    option.textContent = m.nome
                    municipioSelect.appendChild(option)
                })
                municipioSelect.disabled = false
            })
    })
}