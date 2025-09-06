// --- Constantes e Seletores de Elementos ---
const apiCountryURL = "https://flagsapi.com/";
const apiKey = "2c1a83eea7d584c12cf856d8308439a6";

const formularioBusca = document.querySelector('.busca');
const inputBusca = document.querySelector('.searchInput');
const containerResultado = document.querySelector('.resultado');
const containerAviso = document.querySelector('.aviso');

// Elementos do Clima Atual
const elementoCidade = document.querySelector('#cidade');
const elementoPais = document.querySelector('#pais');
const elementoTemperatura = document.querySelector('.tempInfo');
const elementoIconeTemperatura = document.querySelector('.temp img');
const elementoVelocidadeVento = document.querySelector('.ventoInfo');
const elementoDirecaoVento = document.querySelector('.ventoPonto');

// Elementos da Previsão
const forecastContainer = document.querySelector('#containerPrevisao');

// --- Funções ---
const exibirAviso = (msg) => {
    containerAviso.innerHTML = msg;
};

const limparInformacoes = () => {
    exibirAviso('');
    containerResultado.style.display = 'none';
};

const exibirClimaAtual = (dados) => {
    const climaAtual = dados.list[0];

    elementoCidade.innerText = dados.city.name;
    elementoPais.setAttribute('src', `${apiCountryURL}${dados.city.country}/flat/64.png`);
    elementoTemperatura.innerHTML = `${parseInt(climaAtual.main.temp)} <sup>ºC</sup>`;
    elementoVelocidadeVento.innerHTML = `${climaAtual.wind.speed.toFixed(1)} <span>km/h</span>`;
    elementoIconeTemperatura.setAttribute('src', `http://openweathermap.org/img/wn/${climaAtual.weather[0].icon}@2x.png`);
    elementoDirecaoVento.style.transform = `rotate(${climaAtual.wind.deg - 90}deg)`;
};

const exibirPrevisao = (listaDePrevisao) => {
    forecastContainer.innerHTML = ""; 

    const agora = new Date();
    const primeiroIndiceFuturo = listaDePrevisao.findIndex(previsao => new Date(previsao.dt * 1000) > agora);

    const indiceInicial = primeiroIndiceFuturo > -1 ? primeiroIndiceFuturo : 1;

    const quantidadePrevisoes = 5;
    for (let i = indiceInicial; i < indiceInicial + quantidadePrevisoes && i < listaDePrevisao.length; i++) {
        const previsao = listaDePrevisao[i];
        const itemPrevisao = document.createElement("div");
        itemPrevisao.classList.add("previsaoItem");

        const dataPrevisao = new Date(previsao.dt * 1000);
        const hora = dataPrevisao.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const icone = previsao.weather[0].icon;
        const temperatura = parseInt(previsao.main.temp);

        itemPrevisao.innerHTML = `
            <p>${hora}</p>
            <img src="http://openweathermap.org/img/wn/${icone}.png" alt="Condição do tempo">
            <p class="temp">${temperatura}&deg;C</p>
        `;
        containerPrevisao.appendChild(itemPrevisao);
    }
};

const buscarEExibirClima = async (cidade) => {
    exibirAviso('Carregando...');
    const urlAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cidade)}&units=metric&appid=${apiKey}&lang=pt_br`;

    try {
        const resposta = await fetch(urlAPI);
        const dados = await resposta.json();

        if (dados.cod === "200") {
            exibirAviso('');
            containerResultado.style.display = 'block';
            exibirClimaAtual(dados);
            exibirPrevisao(dados.list);
        } else {
            limparInformacoes();
            exibirAviso('Cidade não encontrada!');
        }
    } catch (erro) {
        limparInformacoes();
        exibirAviso('Ocorreu um erro na busca. Tente novamente.');
        console.error("Erro na busca:", erro);
    }
};

// --- Eventos ---
formularioBusca.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const cidade = inputBusca.value.trim();

    if (cidade) {
        buscarEExibirClima(cidade);
    } else {
        limparInformacoes();
    }
});