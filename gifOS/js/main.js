let inputBuscar = document.getElementById("inputBuscar");
let botonBuscar = document.getElementById("botonBuscar");

botonBuscar.onclick = () => {
    getSearchResults(inputBuscar.value);
}

inputBuscar.oninput = () => {
    getTagsRelated(inputBuscar.value);
}
const apiKey = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"

getTrending();
getTrendingSearch();

