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
            const imgResultados = document.querySelectorAll(".imgResultados")[0].children;
            const resultados = document.querySelector(".resultados");
            resultados.firstElementChild.innerHTML = "Resultados de " + search;

            for (let i = 0 ; i < imgResultados.length; i++) {
                const tituloGif = document.createElement("span");
                tituloGif.innerHTML = JSON.stringify(muchosGifs[i].title);
                imgResultados[i].append(tituloGif);
                
                imgResultados[i].src = JSON.stringify(muchosGifs[i].images.fixed_height.url).replace(/['"]+/g, '');
                //imgResultados[i].style.height = "298px";

                const slugGif = document.createElement("div");
                slugGif.innerHTML = JSON.stringify(muchosGifs[i].slug);
                imgResultados[i].append(slugGif);
            }});
}

function getTrending() {
    const found = fetch('http://api.giphy.com/v1/gifs/trending?limit=10&api_key=' + apiKey)
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
        .then(trendingGifs => {
            //console.log(trendingGifs);
            const imgResultados = document.querySelectorAll(".imgResultados")[0].children;

            for (let i = 0 ; i < imgResultados.length; i++) {
                const tituloGif = document.createElement("span");
                tituloGif.innerHTML = JSON.stringify(trendingGifs[i].title);
                imgResultados[i].append(tituloGif);
                
                imgResultados[i].src = JSON.stringify(trendingGifs[i].images.fixed_height.url).replace(/['"]+/g, '');
                //imgResultados[i].style.height = "298px";
                
                const slugGif = document.createElement("div");
                slugGif.innerHTML = JSON.stringify(trendingGifs[i].slug);
                imgResultados[i].append(slugGif);
            }});
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
            const tagRelated = document.querySelectorAll(".tagSugerido");

            for (let i = 0 ; i < 3; i++) {
                tagRelated[i].style.visibility = "visible" 
                botonRelated = tagRelated[i].childNodes[0];
                botonRelated.innerHTML = JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, '') 
                
                botonRelated.onclick = () => {
                    getSearchResults(JSON.stringify(tagsRelacionados[i].name).replace(/['"]+/g, ''));
                };  
                }
            });
}
