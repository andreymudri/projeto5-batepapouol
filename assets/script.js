let username;
let chat = document.querySelector('#chat');
let objMsg = {
    from: "",
    to: "Todos",
    text: "mensagem digitada",
    type: "message" 
}
entrarSala();

function entrarSala(){
    username = { name: prompt("Qual seu nome?") };
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", username);
    promise.then(conectado);
    promise.then(focarUltimaMSG);
    promise.catch(erro);    
}
//msg de erro.
function erro(response) {
    if (response.response.status === 400) {
        alert("Nome de usuario em uso, tente outro nome.");

        entrarSala();
    } else {
        alert("Você foi desconectado. A pagina irá atualizar.");
        window.location.reload();
    }
}
// faz os updates de conexao e mensagens em X milissegundos
function conectado() {
    atualizar();
    setInterval(manterConexao, 5000);
    setInterval(atualizar, 3000);
    console.log("entrou conectado")
}

function manterConexao() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", username)
    promise.catch(erro);
}
//update das msgs
function atualizar() {
    console.log("atualizar")
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(function (response) {
        chat.innerHTML = '';
        let messages = response.data;
        for (let i = 0; i < messages.length; i++)
        {
            mostrarMensagem(messages[i]);
        }
        focarUltimaMSG();
    });
}

function mostrarMensagem(msg) {
    if (msg.type === 'status') {
        chat.innerHTML += ` 
  <div class="chatmsg status" data-test="message"> <span>(${msg.time})</span> <strong>${msg.from}</strong> ${msg.text} </div>`
    }
    if (msg.type === 'message') {
        chat.innerHTML += ` 
    <div class="chatmsg" data-test="message"> <span>(${msg.time})</span> <strong>${msg.from}</strong> para <strong>Todos</strong>: ${msg.text} </div>`
    }
    
    if (msg.type === 'private_message' && (username.name === msg.to || username.name === msg.from)) {
        chat.innerHTML += ` 
    <div class="chatmsg pvt" data-test="message"> <span>(${msg.time})</span> <strong>${msg.from}</strong> reservadamente para <strong>${msg.to}</strong>: ${msg.text} </div>`
    }

}
function focarUltimaMSG() {
    const Ultimamsg = document.querySelector("#chat .chatmsg:last-child");
    Ultimamsg.scrollIntoView();
    console.log(Ultimamsg);
}
function erromsg() {
    alert('Erro ao postar mensagem.');
    window.location.reload();
}
function enviarMensagem() {
    objMsg.text = document.querySelector('.input-message').value;
    objMsg.from = username.name;
    console.log("botao clicado");
    const Postarmsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',objMsg);
    Postarmsg.then(atualizar);
    Postarmsg.catch(erromsg);
    document.querySelector('.input-message').value = '';
}
