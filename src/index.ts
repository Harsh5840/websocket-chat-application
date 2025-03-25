import { WebSocket, WebSocketServer } from "ws";
 
const wss = new WebSocketServer ({port: 6000});

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets:User[] = [];
 
wss.on("connection",(socket) => {
    
    socket.on("message", (message )=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message );  //converts string to an object
        if(parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === "chat"){
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room
            for (let i=0; i<allSockets.length; i++){
                if(allSockets[i].room === currentUserRoom){
                        allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
        

    })
}) 
