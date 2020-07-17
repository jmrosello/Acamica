//Variables globales
var apiKey = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"
var username = "jrosello";
let stream;
let recorderVideo, recorder;
let blob, blobVideo;
let recording = false;

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
          document.querySelector('h1').innerHTML = 'Captura de video a GIF.<br><strong>Grabación iniciada.</strong>';
    },
    onGifPreview: function(gifURL) {
        video.style.display = "inline-block";
        video2.style.display = "none";
        botonRecord.style.display = "none";
        botonRecord2.style.display = "none";
        stopButton.style.display = "inline-block";
        stopButton2.style.display = "inline-block";
        playButton.style.display = "none";
        progressBar.style.display = "none";
        botonGuardar.style.display = "none";
        titulo.innerHTML = "Capturando Tu Guifo";
        tiempo.style.display = "inline-block";
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
        botonRecord.style.background = "#FFF4FD";
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
      
        /*
        try {
          const respuestaUpload = await fetch("https://upload.giphy.com/v1/gifs?api_key=" + apiKey + "&username=" + username, {
            mode: "cors",
            method: "POST",
            body: form,
          });
          const parsedResponse = await respuestaUpload.json();
          
          //TODO: agregar el final de exito con boton de copiar enlace y descargar guifo. Con listo volver a index.html
          misGifs = await JSON.parse(localStorage.getItem("misGifs"));
          misGifs.push(parsedResponse.data.id);
          localStorage.setItem("misGifs", await JSON.stringify(misGifs));
          console.log("Felicitaciones se subió tu gif");
        } catch (e) {
          console.error(e);
          console.error("Error algo salio mal");
        }
      */} else {
        console.error("No has grabado nada para subir");
      }
};

mostrarVideo();
