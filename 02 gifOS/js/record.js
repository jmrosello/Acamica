//Variables globales
const apiKey = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"
const username = "jrosello";
let stream;
let recorderVideo, recorder;
let blob, blobVideo;
let recording = false;

const root = document.documentElement;
const botonRecord = document.querySelector("#comenzar");
const botonRecord2 = document.querySelector("#camara");
const botonGuardar = document.querySelector("#guardarGiphy");
const botonCerrar = document.querySelector("#cerrar");
const video = document.querySelector("video.vivo");
const video2 = document.querySelector("video.gif");
const stopButton = document.querySelector("#stop-button");
const stopButton2 = document.querySelector("#camara-stop");
const playButton = document.querySelector("#play-button");
const flechaButton = document.querySelector(".flecha");
const progressBar = document.querySelector("#progressBar");
const titulo = document.querySelector(".crearGifos div:nth-child(1)")
const tiempo = document.querySelector("h2");

botonRecord.disabled = true;
botonRecord2.disabled = true;

if(!localStorage.getItem("misGifs")) {
  localStorage.setItem("misGifs", "[]");
}

flechaButton.onclick = () => {
    window.location.href = "index.html";
}


botonRecord.addEventListener("click", capturarVideo);
botonRecord2.addEventListener("click", capturarVideo);
botonGuardar.addEventListener("click", guardarVideo);
stopButton.addEventListener("click", detenerGrabacion);
stopButton2.addEventListener("click", detenerGrabacion);
video.addEventListener("timeupdate", updateProgress, false);
playButton.addEventListener("click", reproducirVideoGrabado);

function calculateDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
    var mili = Math.floor(secs*100 - (hr * 360000) - (min * 6000) - (sec * 100));

    if (hr < 10) {
      hr = "0" + hr;
    }

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }
    
    if (mili < 10) {
      mili = "0" + mili;
    }

    return hr + ':' + min + ':' + sec + ':' + mili;
}

async function mostrarVideo() {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
    video.play();
    botonRecord.disabled = false;
    botonRecord2.disabled = false;
  }

async function capturarVideo() {
  recorder = new RecordRTCPromisesHandler(stream, {
    type: "gif",
    frameRate: 2,
    quality: 10,
    width: 360,
    hidden: 240,
    timeSlice: 1000, // pass this parameter
    onGifRecordingStarted: function() {
          //document.querySelector('h1').innerHTML = 'Captura de video a GIF.<br><strong>Grabación iniciada.</strong>';
          botonRecord.style.display = "none";
          botonRecord2.style.display = "none";
          stopButton.style.display = "inline-block";
          stopButton2.style.display = "inline-block";
          playButton.style.display = "none";
          progressBar.style.display = "none";
          botonGuardar.style.display = "none";
          titulo.innerHTML = "Capturando Tu Guifo";
          tiempo.style.display = "inline-block";  
    },
    onGifPreview: function(gifURL) {
        video.style.display = "inline-block";
        video2.style.display = "none";
        }
  });
  recorderVideo = new RecordRTCPromisesHandler(stream, {
    type: "video",
    frameRate: 2,
    quality: 10,
    width: 360,
    hidden: 240,
  });
  recorderVideo.startRecording();
  recorder.startRecording();

  dateStarted = new Date().getTime(); 
  (function looper() {
      if(!recorderVideo) {
          return;
      }
      
      tiempo.innerHTML = calculateDuration((new Date().getTime() - dateStarted) / 1000);

      setTimeout(looper, 100);
  })();
};

async function detenerGrabacion(){
    if ((await recorderVideo.getState()) === "recording") {
        await recorderVideo.stopRecording();
        await recorder.stopRecording();
        blobVideo = await recorderVideo.getBlob();
        blob = await recorder.getBlob();

        recorder.destroy();
        recorderVideo.destroy();
        recorder = "";
        recorderVideo = "";

        botonRecord.style.display = "inline-block";
        botonRecord.innerHTML = "Repetir Captura";
        botonRecord.style.background = "var(--fondo)";
        botonRecord.style.marginLeft = "118px";
        playButton.style.display = "inline-block";
        progressBar.style.display = "inline-block";
        botonGuardar.style.display = "inline-block";
        titulo.innerHTML = "Vista Previa";
        
        stopButton.style.display = "none";
        stopButton2.style.display = "none";
        botonCerrar.style.display = "none";

        video.style.display = "none";
        video2.src = URL.createObjectURL(blobVideo);
        video2.style.display = "inline-block";
        video2.style.opacity = "0.3"
    }
};

function updateProgress() {
    const progress = document.getElementById("progress");
    let value = 0;
    if (video2.currentTime > 0) {
        value = Math.floor((video2.currentTime / video2.duration) * 100);
    }
    progress.style.width = value + "%";
}

function reproducirVideoGrabado() {
    video2.play();
}


async function getGifsLocales(id) {
  if(id) {
      let newId = JSON.stringify(id).replace(/['"]+/g, '').replace(/[\[\]']+/g, '').replace(/[',]+/g, '%2C');
      let respuestaGifID = await fetch('https://api.giphy.com/v1/gifs?api_key=' + apiKey + '&ids=' + newId);
      gifJson = await respuestaGifID.json();
      //console.log(gifJson.data);
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
//      botonCancelar.style.color = "white";
      botonRecord.style.color = "white";
      botonRecord2.firstChild.src = "img/camera_light.svg";
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
//      botonCancelar.style.color = "#110038";
      botonRecord.style.color = "#110038";
      logo.src ="img/gifOF_logo.png";
      botonRecord2.firstChild.src = "img/camera.svg";
  }
}


async function guardarVideo() {
    if (blob) {
        let form = new FormData();
        form.append("file", blob, "acamica.gif");

        botonRecord.style.display = "none";
        playButton.style.display = "none";
        botonGuardar.style.display = "none";
        progressBar.style.display = "none";
        tiempo.style.display = "none";
        video.style.display = "none";
        video2.style.display = "none";

        titulo.innerHTML = "Subiendo Guifo";
        containerDiv = document.createElement("div");
        containerDiv.style.backgroundColor = "white";
        containerDiv.style.border = "1px solid #979797";
        containerDiv.style.boxShadow = "inset -2px -2px 0 0 #E6E6E6, inset 2px 2px 0 0 #000000";
        containerDiv.style.marginLeft = "5px";
        containerDiv.style.marginTop = "9px";
        containerDiv.style.width = "836px";
        containerDiv.style.height = "434px";
        
        imagenPlaneta = document.createElement("img");
        imagenPlaneta.src = "img/globe_img.png";
        imagenPlaneta.style.marginTop = "139px";
        imagenPlaneta.style.marginLeft = "405px";
        spanSubiendo = document.createElement("span");
        spanSubiendo.innerHTML = "Estamos subiendo tu guifo..."
        spanSubiendo.style.marginLeft = "314px";
        spanSubiendo.style.marginTop = "1px";
        spanSubiendo.style.fontSize = "16px";
        spanSubiendo.style.display = "block";
        spanSubiendo.style.fontWeight = "bold";
        
        spanTiempo = document.createElement("span");
        spanTiempo.innerHTML = "Tiempo restante: <strike>38 años</strike> algunos minutos"
        spanTiempo.style.marginLeft = "303px";
        spanTiempo.style.marginTop = "68px";
        spanTiempo.style.display = "block";
        spanTiempo.style.fontSize = "12px";
        spanTiempo.style.color = "rgba(17,0,56,0.64)";

        ventana = document.querySelector(".crearGifos div");
        ventana.parentNode.insertBefore(containerDiv, ventana.nextSibling);
        containerDiv.append(imagenPlaneta);
        containerDiv.append(spanSubiendo);
        containerDiv.append(spanTiempo);

        botonCancelar = document.createElement("button");
        botonCancelar.innerHTML = "Cancelar";
        botonCancelar.style.background = "rgb(255, 244, 253)";
        botonCancelar.style.marginLeft = "699px";
        botonCancelar.style.width = "146px";
        document.querySelector(".flexy").append(botonCancelar);

        botonCancelar.onclick = () => {
          window.location.href = "index.html";
        }
        
        setTimeout(() => {
          }, 2500);
        
        try {
          const respuestaUpload = await fetch("https://upload.giphy.com/v1/gifs?api_key=" + apiKey + "&username=" + username, {
            mode: "cors",
            method: "POST",
            body: form,
          });
          const parsedResponse = await respuestaUpload.json();

          misGifs = await JSON.parse(localStorage.getItem("misGifs"));
          misGifs.push(parsedResponse.data.id);
          localStorage.setItem("misGifs", await JSON.stringify(misGifs));
      
          containerDiv.style.display = "none";
          video2.style.display = "inline-block";
          video2.style.width = "365px";
          video2.style.height = "191px";
          video2.style.marginLeft = "24px";
          video2.style.marginTop = "24px";
          ventana.parentNode.style.width = "718px";
          ventana.parentNode.style.height = "391px";
          ventana.parentNode.style.marginLeft = "360px";
          botonCancelar.style.marginLeft = "528px";
          botonCancelar.style.marginTop = "58px";
          botonCancelar.style.width = "146px";
          botonCancelar.style.background = "var(--rosa)";
          botonCancelar.innerHTML = "Listo";

          spanFinal = document.createElement("span");
          spanFinal.innerHTML = "Guifo creado con éxito";
          spanFinal.style.fontSize = "16px";
          spanFinal.style.display = "inline-block";
          spanFinal.style.fontWeight = "bold";
          spanFinal.style.position = "absolute";
          spanFinal.style.left = "779px";
          spanFinal.style.top = "282px";
          
          botonCopiar = document.createElement("button");
          botonCopiar.innerHTML = "Copiar Enlace Guifo";
          botonCopiar.style.width = "256px";
          botonCopiar.style.background = "var(--fondo)";
          botonCopiar.style.position = "absolute";
          botonCopiar.style.left = "779px";
          botonCopiar.style.top = "302px";
          
          botonDownload = document.createElement("button");
          botonDownload.innerHTML = "Descargar Guifo";
          botonDownload.style.width = "256px";
          botonDownload.style.background = "var(--fondo)";
          botonDownload.style.position = "absolute";
          botonDownload.style.left = "779px";
          botonDownload.style.top = "352px";

          titulo.innerHTML = "Guifo Subido Con Éxito";
          botonCerrar.style.display = "inline-block";

          video2.parentNode.insertBefore(botonDownload, video2.nextSibling);
          video2.parentNode.insertBefore(botonCopiar, video2.nextSibling);
          video2.parentNode.insertBefore(spanFinal, video2.nextSibling);

          document.querySelector(".resultados").style.display = "inline-block";
          document.querySelector(".hoy").innerHTML = "Mis guifos";
          if (localStorage.getItem("misGifs").length > 2) {
              getGifsLocales(localStorage.getItem("misGifs"));
          } else {
              document.querySelector(".imgResultados").innerHTML = "No tienes Guifos cargados.";
          }
          console.log("Felicitaciones se subió tu gif");
          
        } catch (e) {
          console.error(e);
          console.error("Error algo salio mal");
        }
      } else {
        console.error("No has grabado nada para subir");
      }
};

window.onload = function () {
  let rosaOld = "#F7C9F3"
  if (localStorage.getItem("rosa") == "#F7C9F3") {
      rosaOld = "#EE3EFE";
  }

  cambiarColores(rosaOld);
  mostrarVideo();
};
