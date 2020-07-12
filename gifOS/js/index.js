let inputBuscar = document.getElementById("inputBuscar");
let botonBuscar = document.getElementById("botonBuscar");
let tagRelated = document.querySelectorAll(".tagSugerido");
let busquedas = [];

if(localStorage.getItem("busquedas")) {
    let busquedas = JSON.parse(localStorage.getItem("busquedas"));    
    busquedas.forEach(item => {
        console.log(item);
    })
}

botonBuscar.onclick = () => {
    busquedas.push(inputBuscar.value);
    localStorage.setItem("busquedas",JSON.stringify(busquedas));
    getSearchResults(inputBuscar.value);
    tagRelated[0].parentElement.style.display = "none";
    document.querySelector(".sugeridos").style.display = "none";
}

inputBuscar.oninput = () => {
    if (inputBuscar.value.length == 0) {
        botonBuscar.disabled = true;
        botonBuscar.style.backgroundColor = "#E6E6E6";
        botonBuscar.style.color = "#B4B4B4";
        botonBuscar.firstChild.src = "img/lupa_inactive.svg";
    } else {
        botonBuscar.disabled = false;
        botonBuscar.style.backgroundColor = "#F7C9F3";
        botonBuscar.style.color = "#110038";
        botonBuscar.firstChild.src = "img/lupa.svg";
        getTagsRelated(inputBuscar.value);
    }
}
const API_KEY = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"
const GIF_LIMIT = "12"
let search;
getTrending();
getTrendingSearch();

async function getSearchResults(search) {
    let found = await fetch('http://api.giphy.com/v1/gifs/search?limit=' + GIF_LIMIT + '&q=' + search + '&api_key=' + API_KEY)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(muchosGifs => {
            document.querySelector(".resultados .hoy").innerHTML = search[0].toUpperCase() + search.slice(1) + " (resultados)";
            inputBuscar.value = search[0].toUpperCase() + search.slice(1);
            placeGifs(muchosGifs);
        });
}

async function placeGifs(gifs) {
    let divContainerResultados = document.querySelector(".imgResultados");
    divContainerResultados.innerHTML = "";

    for (let i = 0 ; i < gifs.length; i++) {
        let divResultado = document.createElement("div");
        let figResultado = document.createElement("figure");
        let imgResultado = document.createElement("img");
        let slugGif = document.createElement("figcaption");
        let slugHash = "";

        figResultado.append(slugGif);
        figResultado.append(imgResultado)
        divResultado.append(figResultado);

        slugArray = JSON.stringify(gifs[i].slug).replace(/['"]+/g, '').split('-');
        slugArray.pop();
        slugArray.forEach(item => {
            slugHash = slugHash + " #" + item;
        })

        slugGif.innerHTML = slugHash;
        slugGif.style.display = "none";

        imgResultado.src = await JSON.stringify(gifs[i].images.fixed_height.url).replace(/['"]+/g, '');

        imgResultado.onload = await function() {
            if ((gifs[i].images.fixed_height.width / gifs[i].images.fixed_height.height) > 1.4) {
                divResultado.style.gridColumn = "span 2";
                divResultado.style.width = "592px";
            } else {
                divResultado.style.gridColumn = "span 1";
                divResultado.style.width = "288px";
            }
            divResultado.style.height = "298px";
            imgResultado.style.width = "100%";
            imgResultado.style.objectPosition = "center";
        };

        divContainerResultados.append(divResultado);

        divResultado.onmouseover = function() {
            this.classList.add('mouseOver');
            slugGif.style.display = "inline-block";
            this.style.height = (parseInt(divResultado.style.height) - 6) + "px";
            console.log(this.style.height);
            this.style.width = (parseInt(divResultado.style.width) - 6) + "px";
        };
        divResultado.onmouseout = function() {
            this.classList.remove('mouseOver');
            slugGif.style.display = "none";
            this.style.height = (parseInt(divResultado.style.height) + 6) + "px";
            this.style.width = (parseInt(divResultado.style.width) + 6) + "px";
        };
        
    }
}

async function getTrending() {
    try {
        let found = await (await fetch('http://api.giphy.com/v1/gifs/trending?limit=' + GIF_LIMIT + '&api_key=' + API_KEY)).json();
        placeGifs(found.data);
    }
    catch (error) {console.log(error)}
}

function getTrendingSearch() {
    let found = fetch('http://api.giphy.com/v1/trending/searches?limit=' + GIF_LIMIT + '&api_key=' + API_KEY)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(trendingSearch => {
            let imgSugeridas = document.querySelectorAll(".imgSugeridos");
            
            for (let i = 0 ; i < 8; i++) {
                let search2 = JSON.stringify(trendingSearch[i]).replace(/['"]+/g, '')
                let unSearchGif = fetch('http://api.giphy.com/v1/gifs/search?limit=1&q=' + search2 + '&api_key=' + API_KEY)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        return data.data;
                    })
                    .catch(error => {
                        return error;
                    })
                    .then(unSoloGif => {
                        imgSugeridas[i].src = JSON.stringify(unSoloGif[0].images.fixed_height.url).replace(/['"]+/g, '');
                        imgSugeridas[i].style.objectPosition = "center";
                        imgSugeridas[i].style.width = "97%";
                        let botonCerrar = document.createElement("button");
                        let imgCerrar = document.createElement("img");
                        imgCerrar.src = "img/button3.svg"
                        botonCerrar.append(imgCerrar);

                        imgSugeridas[i].parentNode.firstElementChild.innerHTML = "#" + search2[0].toUpperCase() + search2.slice(1);
                        imgSugeridas[i].parentNode.firstElementChild.append(botonCerrar);
                        imgSugeridas[i].parentNode.lastElementChild.onclick = () => {
                            getSearchResults(search2);
                            imgSugeridas[i].parentNode.parentNode.parentNode.style.display = "none";
                        };

                        botonCerrar.onclick = () => {
                            botonCerrar.parentNode.parentNode.style.display = "none";
                        };
                    });
            }
        });
}

function getTagsRelated(search) {
    let found = fetch('http://api.giphy.com/v1/tags/related/' + search + '?api_key=' + API_KEY)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(tagsRelacionados => {
            tagRelated[0].parentElement.style.display = "inline-block";

            for (let i = 0 ; i < 3; i++) {
                palabra = JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, '');
                tagRelated[i].innerHTML = palabra[0].toUpperCase() + palabra.slice(1);
                
                tagRelated[i].onclick = () => {
                    getSearchResults(JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, ''));
                    tagRelated[0].parentElement.style.display = "none";
                    document.querySelector(".sugeridos").style.display = "none";
                };  
                }
            });
}
