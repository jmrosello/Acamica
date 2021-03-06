let inputBuscar = document.getElementById("inputBuscar");
let botonBuscar = document.getElementById("botonBuscar");
let tagRelated = document.querySelectorAll(".tagSugerido");
let divBusquedas = document.querySelector(".busquedas");
let root = document.documentElement;
let botonCrearGif = document.getElementById("crearGif");
let botonCancelar = document.getElementById("cancelar");
let botonComenzar = document.getElementById("comenzar");
let botonTheme = document.getElementById("theme");
let botonTheme2 = document.querySelector(".theme");
let botonMisGifos = document.getElementById("misGifos");
let divThemes = document.getElementById("chooseTheme");
let logo = document.querySelector(".logo")
let botonDay = document.getElementById("day");
let botonNight = document.getElementById("night");


let rosa = localStorage.getItem("rosa");
let lupa = "img/lupa.svg";
divThemes.style.display = "none";
let busquedas = [];
let gifsLocales = [];
let search;

const API_KEY = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"
const GIF_LIMIT = "12"

window.onload = function () {
    let rosaOld = "#F7C9F3"
    botonBuscar.firstChild.src = "img/Combined_Shape.svg";
    if (localStorage.getItem("rosa") == "#F7C9F3") {
        rosaOld = "#EE3EFE";
    }

    cambiarColores(rosaOld);
    getTrending();
    getTrendingSearch();
};

let populateButtons = () => {
    divBusquedas.innerHTML = "";
    busquedas = JSON.parse(localStorage.getItem("busquedas"));   
    while (busquedas.length>8) {
        busquedas.shift();
    }
    
    localStorage.setItem("busquedas", JSON.stringify(busquedas));

    busquedas.forEach(item => {
        let botonStorage = document.createElement("button");
        botonStorage.classList.add("verMas");
        botonStorage.innerHTML = "# " + item;
        botonStorage.style.position = "static";
        botonStorage.style.width = (parseInt(item.length) * 10) + "px";
        botonStorage.style.minWidth = "81px"
        divBusquedas.append(botonStorage);
    })
};

if(localStorage.getItem("busquedas")) {
    populateButtons()
}

if(!localStorage.getItem("misGifs")) {
    localStorage.setItem("misGifs", "[]");
}

botonBuscar.onclick = () => {
    divThemes.style.display = "none";
    busquedas.push(inputBuscar.value);
    localStorage.setItem("busquedas",JSON.stringify(busquedas));
    getSearchResults(inputBuscar.value);
    tagRelated[0].parentElement.style.display = "none";
    document.querySelector(".sugeridos").style.display = "none";
    divBusquedas.style.display = "inline-block";
    populateButtons();
}

botonCrearGif.onclick = () => {
    divThemes.style.display = "none";
    document.querySelector("section.buscar").style.display = "none";
    document.querySelector("section.sugeridos").style.display = "none";
    document.querySelector("#crearGif").style.display = "none";
    document.querySelector("#theme").style.display = "none";
    document.querySelector(".theme").style.display = "none";
    divBusquedas.style.display = "none";
    document.querySelector("#misGifos").style.display = "none";

    document.querySelector(".flecha").style.display = "block";
    document.querySelector("section.crearGifos").style.display = "block";
    if (localStorage.getItem("misGifs").length > 2) {
        getGifsLocales(localStorage.getItem("misGifs"));
    } else {
        document.querySelector(".imgResultados").innerHTML = "No tienes Guifos cargados.";
    }
}

botonCancelar.onclick = () => {
    document.querySelector("section.buscar").style.display = "inline-block";
    document.querySelector("section.sugeridos").style.display = "inline-block";
    document.querySelector("#crearGif").style.display = "inline-block";
    document.querySelector("#theme").style.display = "inline-block";
    document.querySelector(".theme").style.display = "inline-block";
    document.querySelector("#misGifos").style.display = "inline-block";

    document.querySelector(".flecha").style.display = "none";
    document.querySelector("section.crearGifos").style.display = "none";
}

document.querySelector(".flecha").onclick = botonCancelar.onclick;

botonComenzar.onclick = () => {
    window.location.href = "record.html";
}

logo.onclick = () => {
    document.querySelector("section.buscar").style.display = "inline-block";
    document.querySelector("section.sugeridos").style.display = "inline-block";
    document.querySelector("#crearGif").style.display = "inline-block";
    document.querySelector("#theme").style.display = "inline-block";
    document.querySelector(".theme").style.display = "inline-block";
    document.querySelector("#misGifos").style.display = "inline-block";
    getTrendingSearch();
    document.querySelector("section.crearGifos").style.display = "none";
}

botonTheme.onclick = () => {
    if (divThemes.style.display == "none") {
        divThemes.style.display = "inline-block";
    } else {
        divThemes.style.display = "none";
    }
}

botonTheme2.onclick = botonTheme.onclick;

botonDay.onclick = () => {
    cambiarColores("#EE3EFE");
    divThemes.style.display = "none";
}

botonNight.onclick = () => {
    cambiarColores("#F7C9F3");
    divThemes.style.display = "none";
}


botonMisGifos.onclick = () => {
    document.querySelector("section.buscar").style.display = "none";
    document.querySelector("section.sugeridos").style.display = "none";
    divThemes.style.display = "none";
    divBusquedas.style.display = "none";
    document.querySelector("section.resultados .hoy").style.marginTop = "35px";
    if (localStorage.getItem("misGifs").length > 2) {
        getGifsLocales(localStorage.getItem("misGifs"));
    } else {
        document.querySelector(".imgResultados").innerHTML = "No tienes Guifos cargados.";
    }
}

inputBuscar.oninput = () => {
    if (inputBuscar.value.length == 0) {
        botonBuscar.disabled = true;
        botonBuscar.style.backgroundColor = "var(--gris)";
        botonBuscar.style.color = "var('--gris-shadow')";
        botonBuscar.firstChild.src = lupaInactive;
        tagRelated[0].parentElement.style.display = "none";
    } else {
        botonBuscar.disabled = false;
        botonBuscar.style.backgroundColor = "var(--rosa)";
        botonBuscar.style.color = "#110038";
        botonBuscar.firstChild.src = lupa;
        getTagsRelated(inputBuscar.value);
    }
}

async function cambiarColores(rosa) {
    let logo = document.querySelector(".logo");
    if (rosa == "#F7C9F3") {
        localStorage.setItem("rosa", "#EE3EFE");
        root.style.setProperty('--rosa', "#EE3EFE");
        lupa = "img/lupa_light.svg";
        lupaInactive = "img/Combined_Shape.svg";
        root.style.setProperty('--rosa-focus', "#CE36DB");
        root.style.setProperty('--azul', "#2E32FB");
        root.style.setProperty('--azul-focus', "#2629CC");
        root.style.setProperty('--fondo', "#110038");
        root.style.setProperty('--gris', "#B4B4B4");
        root.style.setProperty('--gris-shadow', "#8F8F8F");
        root.style.setProperty('--gris-tag', "#CCCCCC");
        botonMisGifos.style.color = "white";
        botonCancelar.style.color = "white";
        logo.src ="img/gifOF_logo_dark.png";
    } else {
        localStorage.setItem("rosa", "#F7C9F3");
        root.style.setProperty('--rosa', "#F7C9F3");
        lupa = "img/lupa.svg";
        lupaInactive = "img/lupa_inactive.svg";
        root.style.setProperty('--rosa-focus', "#E6BBE2");
        root.style.setProperty('--azul', "#4180F6");
        root.style.setProperty('--azul-focus', "#3A72DB");
        root.style.setProperty('--fondo', "#FFF4FD");
        root.style.setProperty('--gris', "#E6E6E6");
        root.style.setProperty('--gris-shadow', "#B4B4B4");
        root.style.setProperty('--gris-tag', "#F0F0F0");
        botonMisGifos.style.color = "#110038";
        botonCancelar.style.color = "#110038";
        logo.src ="img/gifOF_logo.png";
    }
}

async function getSearchResults(search) {
    let found = await fetch('https://api.giphy.com/v1/gifs/search?limit=' + GIF_LIMIT + '&q=' + search + '&api_key=' + API_KEY)
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

async function getGifByID(id) {
    respuestaGifID = await fetch('https://api.giphy.com/v1/gifs/' + id + '?api_key=' + API_KEY)
    gifJson = await respuestaGifID.json();
    imagen.src = URL.createObjectURL(gifJson.data);
  };
  

async function getGifsLocales(id) {
    if(id) {
        let newId = JSON.stringify(id).replace(/['"]+/g, '').replace(/[\[\]']+/g, '').replace(/[',]+/g, '%2C');
        let respuestaGifID = await fetch('https://api.giphy.com/v1/gifs?api_key=' + API_KEY + '&ids=' + newId);
        gifJson = await respuestaGifID.json();
        document.querySelector(".resultados .hoy").innerHTML = "Mis guifos";
        placeGifs(gifJson.data);
}

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
            if ((gifs[i].images.fixed_height.width / gifs[i].images.fixed_height.height) > 1.5) {
                divResultado.style.gridColumn = "span 2";
                divResultado.style.width = "588px";
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
        let found = await (await fetch('https://api.giphy.com/v1/gifs/trending?limit=' + GIF_LIMIT + '&api_key=' + API_KEY)).json();
        placeGifs(found.data);
    }
    catch (error) {console.log(error)}
}

function getTrendingSearch() {
    let found = fetch('https://api.giphy.com/v1/trending/searches?limit=' + GIF_LIMIT + '&api_key=' + API_KEY)
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
                let unSearchGif = fetch('https://api.giphy.com/v1/gifs/search?limit=1&q=' + search2 + '&api_key=' + API_KEY)
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
                            busquedas.push(search2[0].toUpperCase() + search2.slice(1));
                            localStorage.setItem("busquedas",JSON.stringify(busquedas));
                            populateButtons();
                            divBusquedas.style.display = "inline-block";
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
    let found = fetch('https://api.giphy.com/v1/tags/related/' + search + '?api_key=' + API_KEY)
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
            tagRelated[0].parentElement.style.position = "absolute";

            for (let i = 0 ; i < 3; i++) {
                palabra = JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, '');
                tagRelated[i].innerHTML = palabra[0].toUpperCase() + palabra.slice(1);
                
                tagRelated[i].onclick = () => {
                    getSearchResults(JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, ''));
                    tagRelated[0].parentElement.style.display = "none";
                    document.querySelector(".sugeridos").style.display = "none";
                    busquedas.push(palabra[0].toUpperCase() + palabra.slice(1));
                    localStorage.setItem("busquedas",JSON.stringify(busquedas));
                    populateButtons();
                    divBusquedas.style.display = "inline-block";                
                };  
                }
            });
}
