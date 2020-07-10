let inputBuscar = document.getElementById("inputBuscar");
let botonBuscar = document.getElementById("botonBuscar");
let tagRelated = document.querySelectorAll(".tagSugerido");

botonBuscar.onclick = () => {
    getSearchResults(inputBuscar.value);
    tagRelated[0].parentElement.style.display = "none";
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
const apiKey = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"

let search;
getTrending();
getTrendingSearch();



async function getSearchResults(search) {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?limit=10&q=' + search + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.info(data);
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(muchosGifs => {
            //console.log(muchosGifs);
            placeGifs(muchosGifs);
        });
}

function placeGifs(gifs) {
    const imgResultados = document.querySelectorAll(".imgResultados div > img");
    const divResultados = document.querySelectorAll(".imgResultados div");
    const resultados = document.querySelector(".resultados");
    if (search) {
        resultados.firstElementChild.innerHTML = "Resultados de " + search;
    }

    for (let i = 0 ; i < imgResultados.length; i++) {
        const tituloGif = document.createElement("span");
        tituloGif.innerHTML = JSON.stringify(gifs[i].title);
        imgResultados[i].append(tituloGif);
        
        imgResultados[i].src = JSON.stringify(gifs[i].images.fixed_height.url).replace(/['"]+/g, '');
        
        imgResultados[i].onload = function() {
            if ((imgResultados[i].width / imgResultados[i].height) >= 1.5) {
                divResultados[i].style.gridColumn = "span 2";
                divResultados[i].style.width = "592px";
            } else {
                divResultados[i].style.gridColumn = "span 1";
                divResultados[i].style.width = "288px";
            }
            imgResultados[i].style.width = "100%";
            imgResultados[i].style.objectPosition = "center";
        };

        const slugGif = document.createElement("div");
        slugGif.innerHTML = JSON.stringify(gifs[i].slug);
        imgResultados[i].append(slugGif);
    }
}

async function getTrending() {
    try {
        const found = await (await fetch('http://api.giphy.com/v1/gifs/trending?limit=10&api_key=' + apiKey)).json();
        placeGifs(found.data);
    }
    catch (error) {console.log(error)}
}

function getTrendingSearch() {
    const found = fetch('http://api.giphy.com/v1/trending/searches?limit=10&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.info(data);
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(trendingSearch => {
            //console.log(trendingSearch);
            const imgSugeridas = document.querySelectorAll(".imgSugeridos");
            
            for (let i = 0 ; i < imgSugeridas.length; i++) {
                let search2 = JSON.stringify(trendingSearch[i]).replace(/['"]+/g, '')
                let unSearchGif = fetch('http://api.giphy.com/v1/gifs/search?limit=1&q=' + search2 + '&api_key=' + apiKey)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        //console.info(data);
                        return data.data;
                    })
                    .catch(error => {
                        return error;
                    })
                    .then(unSoloGif => {
                        imgSugeridas[i].src = JSON.stringify(unSoloGif[0].images.fixed_height.url).replace(/['"]+/g, '');
                        imgSugeridas[i].style.objectPosition = "center";
                        imgSugeridas[i].style.width = "100%";
                        imgSugeridas[i].parentNode.firstElementChild.innerHTML = "#" + search2;
                        imgSugeridas[i].parentNode.lastElementChild.onclick = () => {
                            getSearchResults(search2);
                        };
                    });
            }
        });
}

function getTagsRelated(search) {
    const found = fetch('http://api.giphy.com/v1/tags/related/' + search + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.info(data);
            return data.data;
        })
        .catch(error => {
            return error;
        })
        .then(tagsRelacionados => {
            //console.log(tagsRelacionados);
            tagRelated[0].parentElement.style.display = "inline-block";

            for (let i = 0 ; i < 3; i++) {
                palabra = JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, '');
                tagRelated[i].innerHTML = palabra[0].toUpperCase() + palabra.slice(1);
                
                tagRelated[i].onclick = () => {
                    getSearchResults(JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, ''));
                    tagRelated[0].parentElement.style.display = "none";
                };  
                }
            });
}
