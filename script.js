let video=document.querySelector("video");
let captureBtnCont=document.querySelector(".capture-btn-cont");

let captureBtn=document.querySelector(".capture-btn");
let transparentColor="transparent";

let recorder;
let chunks=[];

let constraints={
    audio:true,
    video:true
};

var uid = new ShortUniqueId();
let shouldRecord=false;
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject=stream;

    recorder=new MediaRecorder(stream);
    recorder.addEventListener('start',(e)=>{
        // memory
        chunks=[];
        console.log('rec started');
    });

    recorder.addEventListener('dataavailable',(e)=>{
        chunks.push(e.data);
        console.log('recording pushed in chunks');
    });

    recorder.addEventListener("stop",()=>{
        let blob=new Blob(chunks,{type:'video/mp4'});
        console.log('rec stopped');

        // download video on desktop
        let videoURL=URL.createObjectURL(blob);
        console.log(videoURL);

        // let a=document.createElement('a');
        // a.href=videoURL;
        // a.download="myVideo.mp4";
        // a.click();

        // store in database
        if(db){
            let videoId=uid();
            let dbTransaction=db.transaction('video','readwrite');
            let videoStore=dbTransaction.objectStore('video');
            let videoEntry={
                id:videoId,
                url:videoURL,
            };
            let addrequest=videoStore.add(videoEntry);
            addrequest.onsuccess=()=>{
                console.log("video added to db successfully");
            };
        }
    })
});


captureBtnCont.addEventListener('click',()=>{
    // adding animation on capture button
    captureBtn.classList.add('scale-capture');


    let canvas=document.createElement('canvas');
    let tool=canvas.getContext('2d');
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;


    tool.drawImage(video,0,0,canvas.width,canvas.height);


    // applying filters on photo

    tool.fillStyle=transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);


    let imageURL=canvas.toDataURL();
    // let img=document.createElement("img");
    // img.src=imageURL;
    // document.body.append(img);

    if(db){
        let imageId=uid();
        let dbTransaction=db.transaction('image','readwrite');
        let imageStore=dbTransaction.objectStore('image');
        let imageEntry={
            id:imageId,
            url:imageURL,
        };
        let addrequest=imageStore.add(imageEntry);
        addrequest.onsuccess=()=>{console.log("image added to db successfully");};
    }


    // removing animation from button
    setTimeout(()=>{
        captureBtn.classList.remove('scale-capture');
    },510);

});

let recordBtnCont=document.querySelector('.record-btn-cont');
let recordBtn=document.querySelector('.record-btn');

recordBtnCont.addEventListener("click",()=>{
    shouldRecord=!shouldRecord;
    if(shouldRecord){
        // recording start
        recorder.start();
        // start timer
        startTimer();
        recordBtn.classList.add("scale-record");
    }else{
        // stop the recording
        recorder.stop();
        // stop the timer
        stopTimer();
        recordBtn.classList.remove('scale-record');
    }
});

let timer=document.querySelector('.timer');
let counter=0;
let timerID;


function startTimer(){
timer.style.display="block";
    function displayTimer(){
        let totalSeconds=counter;

        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;

        let minutes=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;

        let seconds=totalSeconds;

        hours=(hours<10)?`0${hours}`:hours;
        minutes=(minutes<10)?`0${minutes}`:minutes;
        seconds=(seconds<10)?`0${seconds}`:seconds;
        timer.innerText=`${hours}:${minutes}:${seconds}`;

        counter++;
    } 

    timerID=setInterval(displayTimer,1000);
    counter=0;
}
function stopTimer(timerID){
    clearInterval(timerID);
    timer.innerText="00:00:00";
    timer.style.display='none';
}

let filters=document.querySelectorAll('.filter');
let filterLayer=document.querySelector('filter-layer');

filters.forEach((filterElem) => {
    filterElem.addEventListener('click',()=>{
        transparentColor=filterElem.getComputedStyle(filterElem).getPropertyValue('background-color');
    filterLayer.style.backgroundColor=transparentColor;
    });
});
