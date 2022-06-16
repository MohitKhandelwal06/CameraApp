setTimeout(()=>{
    if(db){
    let imageDBTransaction=db.transaction('image','readonly');
    let imageStore=imageDBTransaction.objectStore('image');
    let imageRequest=imageStore.getAll();
    imageRequest.onsuccess= ()=>{
        let imageResult=imageRequest.result;
        let galleryCont=document.querySelector(".show-area");
    
        imageResult.forEach((imageObj)=>{
            let imageElem=document.createElement('div');
            imageElem.setAttribute('class','media-cont');
            imageElem.setAttribute('id',imageObj.id);
            let url=imageObj.url;
            imageElem.innerHTML=`
            <div>
            <img src="${url}" />
            
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn" >DOWNLOAD</div>
            </div>
            `;
    
            galleryCont.appendChild(imageElem);
        });
    }
    
    
    let videoDBTransaction=db.transaction('video','readonly');
    let videoStore=videoDBTransaction.objectStore('video');
    let videoRequest=videoStore.getAll();
    videoRequest.onsuccess= ()=>{
        let videoResult=videoRequest.result;
        let galleryCont=document.querySelector(".show-area");
    
        videoResult.forEach((videoObj)=>{
            let videoElem=document.createElement('div');
            videoElem.setAttribute('class','media-cont');
            videoElem.setAttribute('id',videoObj.id);
            let url=videoObj.url;
            videoElem.innerHTML=`
            <div>
            <video autoplay loop src="${url}" ></video>
            
            <div class="delete action-btn">DELETE</div>
            <div class="download action-btn ">DOWNLOAD</div>
            </div>
            `;
    
            galleryCont.appendChild(videoElem);
        });
    }
}
},100);

function deleteListner(){

}

function downloadListner(){

}
