# terminal.chat

A tiny terminal-based group chat app built with Bun, TypeScript, and WebSockets.

Run the client, pick a name, and messages from other connected users appear directly in your terminal.

## Features

- Terminal-first chat client
- WebSocket server with join and leave notifications
- Broadcasts each message to every other connected client
- Health check endpoint at `/health`
- Docker Compose setup for running the server locally

## Requirements

- [Bun](https://bun.sh)
- Docker, optional, if you want to run the server in a container

## Install

```bash
git clone https://github.com/SainiAdi-04/terminal.chat.git
cd terminal.chat
bun install
```

## Run The Client

The checked-in client connects to the hosted server at:

```text
wss://terminal-chat-bp1v.onrender.com
```

Start chatting with:

```bash
bun run client.ts yourname
```

Once connected, type a message and press Enter. Your own message is echoed as `you: ...`; messages from other users appear as `username: message`.

## Run Your Own Server

Start the server locally:

```bash
bun run server.ts
```

The server listens on `PORT` if set, otherwise it uses `3000`.

```bash
PORT=8080 bun run server.ts
```

You can also run it with Docker Compose:

```bash
docker compose up
```

With the default Docker Compose setup, the server is available on:

```text
ws://localhost:3000
```

## Use A Local Server

`client.ts` currently uses the hosted Render URL. To connect the client to a local server, change the WebSocket URL in `client.ts`:

```ts
const socket = new WebSocket(`ws://localhost:3000?username=${username}`);
```

Then run:

```bash
bun run server.ts
bun run client.ts yourname
```

Open another terminal and run the client again with a different name to test chat between users.

## Build A Binary

Compile the client into a standalone executable:

```bash
bun build client.ts --compile --outfile terminal.chat
```

Then run it:

```bash
./terminal.chat yourname
```

On macOS or Linux, you may need to make it executable first:

```bash
chmod +x terminal.chat
```

## Server API

### Health Check

```text
GET /health
```

Returns:

```text
ok
```

### WebSocket

Connect with a username:

```text
ws://localhost:3000?username=yourname
```

Send chat messages as JSON:

```json
{
  "user": "yourname",
  "text": "hello"
}
```

The server broadcasts messages to every connected client except the sender.

## Project Structure

```text
.
├── client.ts          # Terminal chat client
├── server.ts          # Bun WebSocket server
├── docker-compose.yml # Local container setup
├── dockerfile         # Server container image
├── package.json       # Bun scripts and dependencies
└── tsconfig.json      # TypeScript config
```

## Scripts

```bash
bun run start
```

Runs the WebSocket server.

## Tech Stack

- [Bun](https://bun.sh) runtime and WebSocket server
- TypeScript
- Node `readline` for terminal input
- Docker for local server containers
