// Funções para ler e salvar a lista de usuários em JSON no localStorage
function obterUsuarios() {
    const dadosJson = localStorage.getItem("usuarios");
    if (!dadosJson) {
        return [];
    }
    return JSON.parse(dadosJson);
}

function salvarUsuarios(listaUsuarios) {
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}

// tela de cadastro
const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome_cadastro").value;
        const usuario = document.getElementById("usuario_cadastro").value;
        const dataNasc = document.getElementById("data_nasc_cadastro").value;
        const sexo = document.querySelector('input[name="sexo_cadastro"]:checked').value;
        const fone = document.getElementById("fone_cadastro").value;
        const email = document.getElementById("mail_cadastro").value;
        const senha = document.getElementById("senha_cadastro").value;
        const senhaConf = document.getElementById("senhaConf_cadastro").value;

        if (senha !== senhaConf) {
            alert("As senhas não coincidem!");
            return;
        }

        const listaUsuarios = obterUsuarios();

        // Verifica se já existe o usuário ou e-mail cadastrado
        const jaExiste = listaUsuarios.some(
            (u) => u.usuario === usuario || u.email === email
        );

        if (jaExiste) {
            alert("Usuário ou e-mail já cadastrado!");
            return;
        }

        const novoUsuario = {
            nome: nome,
            usuario: usuario,
            dataNasc: dataNasc,
            sexo: sexo,
            fone: fone,
            email: email,
            senha: senha
        };

        listaUsuarios.push(novoUsuario);
        salvarUsuarios(listaUsuarios);

        // Salva o usuário logado em JSON e vai direto para o perfil
        localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
        alert("Cadastro realizado!");
        window.location.href = "perfil.html";
    });
}

// função da tela de login
const formLogin = document.getElementById("form-login");

if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const loginDigitado = document.getElementById("usuario").value;
        const senhaDigitada = document.getElementById("senha").value;

        const listaUsuarios = obterUsuarios();

        const usuarioEncontrado = listaUsuarios.find(
            (u) =>
                (u.usuario === loginDigitado || u.email === loginDigitado) &&
                u.senha === senhaDigitada
        );

        if (!usuarioEncontrado) {
            alert("Usuário ou senha incorretos!");
            return;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
        window.location.href = "perfil.html";
    });
}

// tela de perfil
const formPerfil = document.getElementById("form-perfil");

if (formPerfil) {
    const usuarioLogadoJson = localStorage.getItem("usuarioLogado");

    // Preenche os campos da tela com os dados do JSON do usuário logado
    if (usuarioLogadoJson) {
        const usuarioLogado = JSON.parse(usuarioLogadoJson);

        document.getElementById("nome_alterar").value = usuarioLogado.nome;
        document.getElementById("usuario_alterar").value = usuarioLogado.usuario;
        document.getElementById("data_nasc_alterar").value = usuarioLogado.dataNasc;
        document.getElementById("fone_alterar").value = usuarioLogado.fone;
        document.getElementById("mail_alterar").value = usuarioLogado.email;

        const radioSexo = document.querySelector(
            'input[name="sexo_alterar"][value="' + usuarioLogado.sexo + '"]'
        );
        if (radioSexo) {
            radioSexo.checked = true;
        }
    }

    // Salva as alterações do perfil no JSON
    formPerfil.addEventListener("submit", function (event) {
        event.preventDefault();

        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioLogado) return;

        const novaSenha = document.getElementById("senha_alterar").value;
        const novaSenhaConf = document.getElementById("senhaConf_alterar").value;

        if (novaSenha !== "" && novaSenha !== novaSenhaConf) {
            alert("As senhas não coincidem!");
            return;
        }

        const dadosAtualizados = {
            nome: document.getElementById("nome_alterar").value,
            usuario: document.getElementById("usuario_alterar").value,
            dataNasc: document.getElementById("data_nasc_alterar").value,
            sexo: document.querySelector('input[name="sexo_alterar"]:checked').value,
            fone: document.getElementById("fone_alterar").value,
            email: document.getElementById("mail_alterar").value,
            senha: novaSenha !== "" ? novaSenha : usuarioLogado.senha
        };

        const listaUsuarios = obterUsuarios();
        const indice = listaUsuarios.findIndex((u) => u.usuario === usuarioLogado.usuario);

        if (indice !== -1) {
            listaUsuarios[indice] = dadosAtualizados;
            salvarUsuarios(listaUsuarios);
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(dadosAtualizados));
        alert("Perfil atualizado com sucesso!");
    });
}
