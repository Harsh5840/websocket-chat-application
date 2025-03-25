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
            console.log("user joinde room" + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === "chat"){
            const currentUser = allSockets.find((x) => x.socket == socket);
            const currentUserRoom = currentUser ? currentUser.room : null;
            for (let i=0; i<allSockets.length; i++){
                if(allSockets[i].room === currentUserRoom){
                        allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }
        

    })
}) 
