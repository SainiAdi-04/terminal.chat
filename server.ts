import type { ServerWebSocket } from "bun";

interface messageInterface  {
    user: string
    text: string
}

const clients = new Set<ServerWebSocket<unknown>>(); 

//ws is a person specific object created everytime someone connects and has a lot of capabilities. They're different objects even though they're both of type ServerWebSocket.

Bun.serve({
    fetch(req,server){
        if (server.upgrade(req)){
            return;
        }
        return new Response("Upgrade failed", {status:500});
    },
    websocket: {
        open(ws){
            console.log("conencted!");
            ws.send("Welcome!")
            clients.add(ws)
        },
        message(ws, message) {
            console.log("Received:", message.toString());
            const parsed= JSON.parse(message.toString()) as messageInterface
            const formatted = `${parsed.user}: ${parsed.text}`
            for (const client of clients){
                if(client!=ws){
                    client.send(formatted)
                }
            }
        },
        close(ws, code, message){
            clients.delete(ws)
            console.log("client disconnected")
        },
        drain(ws){}
    }
});