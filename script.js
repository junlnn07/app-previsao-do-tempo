const key = "5be142b2adf71122421c1e95284be4ac";

const input = document.querySelector(".input-cidade");
const botao = document.querySelector(".botao-busca");
const cidadeTexto = document.querySelector(".cidade");
const tempTexto = document.querySelector(".temp");
const textoPrevisao = document.querySelector(".texto-previsao");
const icone = document.querySelector(".icone");
const umidadeTexto = document.querySelector(".umidade-texto");
const containerPrevisao = document.querySelector(".previsao-container");

function cliqueiNoBotao() {
    const cidade = input.value;
    if(cidade) buscarCidade(cidade);
}

function pegarDiaSemana(dataString) {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = new Date(dataString * 1000);
    return dias[data.getDay()];
}

async function buscarCidade(cidade) {
    try {
        const respostaAtual = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`);
        const dadosAtual = await respostaAtual.json();

        if (dadosAtual.cod === "404") {
            alert("Cidade não encontrada!");
            return;
        }

        const respostaPrevisao = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${key}&lang=pt_br&units=metric`);
        const dadosPrevisao = await respostaPrevisao.json();

        mostrarDadosAtuais(dadosAtual);
        mostrarPrevisao(dadosPrevisao);

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar.");
    }
}

function mostrarDadosAtuais(dados) {
    cidadeTexto.innerText = dados.name + ", " + dados.sys.country;
    tempTexto.innerText = Math.floor(dados.main.temp) + "°C";
    textoPrevisao.innerText = dados.weather[0].description;
    umidadeTexto.innerText = "Umidade: " + dados.main.humidity + "%";
    icone.src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`;
}

function mostrarPrevisao(dados) {
    containerPrevisao.innerHTML = ""; 
    const indicesParaPegar = [7, 15, 23, 31]; 

    indicesParaPegar.forEach(index => {
        if(dados.list[index]) {
            const dia = dados.list[index];
            const html = `
                <div class="dia-item">
                    <p class="dia-nome">${pegarDiaSemana(dia.dt)}</p>
                    <img class="dia-icone" src="https://openweathermap.org/img/wn/${dia.weather[0].icon}.png" alt="icon">
                    <p class="dia-temp">${Math.floor(dia.main.temp)}°C</p>
                </div>
            `;
            containerPrevisao.innerHTML += html;
        }
    });
}

botao.addEventListener("click", cliqueiNoBotao);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") cliqueiNoBotao();
});

buscarCidade("São Paulo");