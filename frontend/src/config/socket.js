import socket from 'socket.io-client';

let socketinstance = null ;


const initializeSocket = (projectId)=>{
    socketinstance = socket("http://localhost:8080" , {
        auth : {
            token : localStorage.getItem('token')
        },
        query : {
            projectId
        }

    });

    return socketinstance
}

const receiveMessage = (eventName , cb)=>{
    socketinstance.on(eventName , cb )

}
const sendMessage = (eventName , data)=>{

    socketinstance.emit(eventName , data )

 
    
}

export { initializeSocket , receiveMessage , sendMessage}

