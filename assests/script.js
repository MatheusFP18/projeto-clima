document.querySelector('.busca').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    let input = document.querySelector('.searchInput').value;

    if (input !== '') {
        showWarning('Carregando...');

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=2c1a83eea7d584c12cf856d8308439a6&units=metric&lang=pt_br`;

        let result = await fetch(url);
        let json = await result.json();

        if (json.cod === 200) {
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                windDeg: json.wind.deg
            })

        } else {
            clearInfo();
            showWarning('Cidade não encontrada!');
        }
    }

});

function showInfo(json) {
    showWarning('');

    document.querySelector('.resultado').style.display = 'block';

    document.querySelector('.resultado .titulo').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.resultado .tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`;
    document.querySelector('.resultado .ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`;

    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windDeg - 90}deg)`;
}

function clearInfo() {
    showWarning('');
    document.querySelector('.resultado').style.display = 'none';
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg;
}