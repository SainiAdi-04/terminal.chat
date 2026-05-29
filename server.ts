process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err)
})

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
    hostname: "0.0.0.0",
    port: Number(process.env.PORT) || 3000,

    fetch(req, server) {
        const url = new URL(req.url);
        if (url.pathname === "/health") {
            return new Response("ok");
        }
        const username = url.searchParams.get("username") ?? "Anon";

        if (server.upgrade(req, { data: { username } })) {
            return new Response(null);
        }

        return new Response("Server is running", { status: 200 });
    },

    websocket: {
        open(ws) {
            console.log("connected!");
            ws.send("Welcome!");
            clients.add(ws);

            for (const client of clients) {
                if (client !== ws) {
                    client.send(`${ws.data.username} joined!`);
                }
            }
        },

        message(ws, message) {
            try {
                const parsed = JSON.parse(message.toString()) as messageInterface;

                for (const client of clients) {
                    if (client !== ws) {
                        client.send(`${parsed.user}: ${parsed.text}`);
                    }
                }
            } catch {
                ws.send("Invalid message format");
            }
        },

        close(ws) {
            clients.delete(ws);

            for (const client of clients) {
                client.send(`${ws.data.username} left`);
            }
        }
    }
});

console.log("Server started on", process.env.PORT || 3000);
