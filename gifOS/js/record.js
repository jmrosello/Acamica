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

        //TODO: agregar el div con el "Estamos subiendo tu guifo..."
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
      } else {
        console.error("No has grabado nada para subir");
      }
};

mostrarVideo();
