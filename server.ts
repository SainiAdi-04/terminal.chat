import type { ServerWebSocket } from "bun";

interface messageInterface {
    user: string
    text: string
}

type ClientData = {
    username: string;
};

const clients = new Set<ServerWebSocket<ClientData>>();

//ws is a person specific object created everytime someone connects and has a lot of capabilities. They're different objects even though they're both of type ServerWebSocket.

Bun.serve<ClientData>({
    port: 3000,
    fetch(req, server) {
        const url = new URL(req.url)
        const username = url.searchParams.get("username") ?? "Anon"
        if (server.upgrade(req, { data: { username } })) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open(ws) {
            console.log("conencted!");
            ws.send("Welcome!")
            clients.add(ws);
            for (const client of clients) {
                if (client !== ws) {
                    client.send(`${ws.data.username} joined!`)
                }
            }
        },
        message(ws, message) {
            try {
                console.log("Received:", message.toString());
                const parsed = JSON.parse(message.toString()) as messageInterface
                const formatted = `${parsed.user}: ${parsed.text}`
                for (const client of clients) {
                    if (client !== ws) {
                        client.send(formatted)
                    }
                }
            } catch (error) {
                ws.send("Invalid message format");
            }

        },
        close(ws) {
            clients.delete(ws)
            for (const client of clients) {
                client.send(`${ws.data.username} left`)
            }
            console.log("client disconnected")
        },
        drain(ws) { }
    }
});
