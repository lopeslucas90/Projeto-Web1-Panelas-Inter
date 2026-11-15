// ==========================================
// MÓDULO DE USUÁRIOS (LOCALSTORAGE)
// ==========================================
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

// Tela de Cadastro
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

        localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
        alert("Cadastro realizado!");
        window.location.href = "perfil.html";
    });
}

// Tela de Login
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

// Tela de Perfil
const formPerfil = document.getElementById("form-perfil");

if (formPerfil) {
    const usuarioLogadoJson = localStorage.getItem("usuarioLogado");

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

// ==========================================
// CARREGAMENTO DINÂMICO DA RECEITA (RECEITAS.JSON)
// ==========================================
const pagReceita = document.querySelector(".pag_receitas");

if (pagReceita) {
    const urlParams = new URLSearchParams(window.location.search);
    const idReceita = urlParams.get("id");

    if (idReceita) {
        fetch("receitas/receitas.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar o arquivo de receitas.");
                }
                return response.json();
            })
            .then((receitas) => {
                const receita = receitas.find((r) => r.id === idReceita);

                if (receita) {
                    document.getElementById("receita-nome").textContent = receita.nome;
                    document.getElementById("receita-descricao").textContent = receita.descricao;
                    document.getElementById("receita-imagem").src = receita.imagem;
                    document.getElementById("receita-tempo").textContent = `Tempo de Preparo: ${receita.tempopreparo}`;
                    document.getElementById("receita-rendimento").textContent = `Rendimento: ${receita.rendimento}`;
                    document.getElementById("receita-dificuldade").textContent = `Dificuldade: ${receita.dificuldade}`;

                    const ulIngredientes = document.getElementById("receita-ingredientes");
                    if (ulIngredientes) {
                        ulIngredientes.innerHTML = "";
                        receita.ingredientes.forEach((item) => {
                            if (item.endsWith(":")) {
                                const h3 = document.createElement("h3");
                                h3.textContent = item;
                                ulIngredientes.appendChild(h3);
                            } else {
                                const li = document.createElement("li");
                                li.textContent = item;
                                ulIngredientes.appendChild(li);
                            }
                        });
                    }

                    const olPreparo = document.getElementById("receita-preparo");
                    if (olPreparo) {
                        olPreparo.innerHTML = "";
                        receita.preparo.forEach((passo) => {
                            if (passo.endsWith(":")) {
                                const h3 = document.createElement("h3");
                                h3.textContent = passo;
                                olPreparo.appendChild(h3);
                            } else {
                                const li = document.createElement("li");
                                li.textContent = passo;
                                olPreparo.appendChild(li);
                            }
                        });
                    }

                    const audioElem = document.getElementById("receita-audio");
                    const audioSource = document.getElementById("receita-audio-src");
                    if (receita.audio) {
                        audioSource.src = receita.audio;
                        audioElem.load();
                        audioElem.style.display = "block";
                    } else {
                        audioElem.style.display = "none";
                    }

                    const videoElem = document.getElementById("receita-video");
                    if (videoElem) {
                        if (receita.video) {
                            videoElem.src = receita.video; // Se o elemento for um <iframe>
                            videoElem.style.display = "block";
                        } else {
                            videoElem.style.display = "none";
                        }
                    }

                } else {
                    alert("Receita não encontrada!");
                }
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }
}


// ==========================================
// MÓDULO DE CADASTRO DE NOVAS RECEITAS
// ==========================================

function adicionarCampoIngrediente() {
    const container = document.getElementById("container-ingredientes");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "ingrediente-item";
    input.placeholder = "Outro ingrediente...";
    input.required = true;
    
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

function adicionarCampoPasso() {
    const container = document.getElementById("container-passos");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "passo-item";
    input.placeholder = "Próximo passo...";
    input.required = true;
    
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

function lerArquivoComoBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function salvarNovaReceita(event) {
    event.preventDefault();

    const nome = document.getElementById("nome_nreceita").value;
    const tipoElement = document.querySelector('input[name="tipo_nreceita"]:checked');
    const tipo = tipoElement ? tipoElement.value : "Salgado";
    const descricao = document.getElementById("descricao_nreceita").value;
    const tempopreparo = document.getElementById("tempo_nreceita").value;
    const rendimento = document.getElementById("rendimento_nreceita").value;
    const dificuldadeElement = document.querySelector('input[name="dificuldade_nreceita"]:checked');
    const dificuldade = dificuldadeElement ? dificuldadeElement.value : "Fácil";

    // Captura os arquivos dos inputs
    const fotoFile = document.getElementById("foto_nreceita").files[0];
    const videoFile = document.getElementById("video_nreceita").files[0];
    const audioFile = document.getElementById("audio_nreceita").files[0];

    // Converte os arquivos para Base64
    const imagem = await lerArquivoComoBase64(fotoFile);
    const video = await lerArquivoComoBase64(videoFile);
    const audio = await lerArquivoComoBase64(audioFile);

    // Coleta ingredientes em array
    const ingredientes = [];
    document.querySelectorAll(".ingrediente-item").forEach(input => {
        if (input.value.trim() !== "") ingredientes.push(input.value.trim());
    });

    // Coleta passos em array
    const preparo = [];
    document.querySelectorAll(".passo-item").forEach(input => {
        if (input.value.trim() !== "") preparo.push(input.value.trim());
    });

    // Geração de ID simples (transforma em minúsculo e troca espaços por hífen)
    const id = nome.toLowerCase().replaceAll(" ", "-");

    const novaReceita = {
        id,
        nome,
        tipo,
        descricao,
        tempopreparo,
        rendimento,
        dificuldade,
        imagem,
        video: video || undefined,
        audio: audio || undefined,
        ingredientes,
        preparo
    };

    // Salva no localStorage
    let receitasSalvas = JSON.parse(localStorage.getItem("minhas_receitas")) || [];
    receitasSalvas.push(novaReceita);
    localStorage.setItem("minhas_receitas", JSON.stringify(receitasSalvas));

    alert("Obrigado! Em breve, analisaremos e postaremos a sua receita!");
    window.location.href = `receita.html?id=${id}`;
}

// Vincula os eventos ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    const btnAddIngrediente = document.getElementById("btn-add-ingrediente");
    const btnAddPasso = document.getElementById("btn-add-passo");
    const formCadastro = document.getElementById("form-nova-receita");

    if (btnAddIngrediente) btnAddIngrediente.addEventListener("click", adicionarCampoIngrediente);
    if (btnAddPasso) btnAddPasso.addEventListener("click", adicionarCampoPasso);
    if (formCadastro) formCadastro.addEventListener("submit", salvarNovaReceita);
});
