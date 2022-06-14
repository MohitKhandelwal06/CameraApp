// Connect to database
let db;
let openRequest=indexedDB.open('myDatabase');

openRequest.addEventListener('success',()=>{
    console.log('db connected');
    db=openRequest.result;
});

openRequest.addEventListener("upgradeneeded", ()=>{
    console.log("db upgraded or initialized");
    db=openRequest.result;

    db.createObjectStore('image',{keyPath:'id'});
    db.createObjectStore('video',{keyPath:'id'});

});

openRequest.addEventListener('error', ()=>{
    console.log('Error in connecting to database');
});

