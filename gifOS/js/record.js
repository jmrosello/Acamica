//Variables globales
var apiKey = "CENhLNWgDzlOGLtY8yMGKohU96s8uvK1"
var username = "jrosello";
let stream;
let recorderVideo, recorder;
let blob, blobVideo;
let recording = false;

const botonRecord = document.querySelector("#record");
const botonGuardar = document.querySelector("#guardarGiphy");
const video = document.querySelector("video");
const video2 = document.querySelector("video.gif");
const stopButton = document.querySelector("#stop-button");
const playButton = document.querySelector("#play-button");

botonRecord.addEventListener("click", capturarVideo);
botonGuardar.addEventListener("click", guardarVideo);
stopButton.addEventListener("click", detenerGrabacion);
video.addEventListener("timeupdate", updateProgress, false);
playButton.addEventListener("click", reproducirVideoGrabado);


function calculateDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs*10 - (hr * 36000) - (min * 600))/10;

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if(hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
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
  botonRecord.disabled = true;
  botonGuardar.disabled = false;
  video.classList.add("video-recording");

  recorder = new RecordRTCPromisesHandler(stream, {
    type: "gif",
    frameRate: 2,
    quality: 10,
    width: 360,
    hidden: 240,
    timeSlice: 1000, // pass this parameter
    onGifRecordingStarted: function() {
          document.querySelector('h1').innerHTML = 'Captura de video a GIF.<br><strong>Grabación iniciada.</strong>';
    }/*,
    onGifPreview: function(gifURL) {
        imagen.src = gifURL;
    }*/
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

      document.querySelector('h2').innerHTML = 'Duracion grabacion: ' + calculateDuration((new Date().getTime() - dateStarted) / 1000);

      setTimeout(looper, 100);
  })();

  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  await sleep(4000);
  detenerGrabacion();
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
        stopButton.hidden = true;
        botonRecord.hidden = false;
        video.classList.remove("video-recording");

        video2.src = URL.createObjectURL(blobVideo);
    }
};

function updateProgress() {
    const progress = document.getElementById("progress");
    let value = 0;
    if (video.currentTime > 0) {
        value = Math.floor(
        (100 / video.duration) * video.currentTime
        );
    }
    progress.style.width = value + "%";
}

function reproducirVideoGrabado() {
    video2.play();
}

async function guardarVideo() {
    if (blob) {
        let form = new FormData();
        const gifName = prompt("Ingresa nombre para el gif") || "migif";
        form.append("file", blob, gifName + ".gif");

        try {
          const respuestaUpload = await fetch("https://upload.giphy.com/v1/gifs?api_key=" + apiKey + "&username=" + username, {
            mode: "cors",
            method: "POST",
            body: form,
          });
          const parsedResponse = await respuestaUpload.json();
          
          localStorage.setItem("myGifs", JSON.stringify(parsedResponse.data.id));
          console.log("Felicitaciones se subió tu gif 👏 👏");
        } catch (e) {
          console.log(e);
          alert("Error algo salio mal 😭");
        }
      } else {
        alert("👁 no has grabado nada para subir");
      }
};

mostrarVideo();
