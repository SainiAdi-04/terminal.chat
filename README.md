# terminal.chat

A minimal terminal chat app. Connect with friends over the internet directly from your terminal.

## Usage

Download the binary for your OS from the releases page, then:

```bash
# give it execute permissions (mac/linux)
chmod +x terminal.chat

# connect
./terminal.chat yourname
```

That's it. You're in.

## Commands

There are no commands. Just type and hit enter.

## Building from source

Requires [Bun](https://bun.sh).

```bash
# clone the repo
git clone https://github.com/SainiAdi-04/terminal-chat.git
cd terminal-chat

# run the client directly
bun run client.ts yourname

# or compile your own binary
bun build client.ts --compile --outfile terminal.chat
```

## Running your own server

```bash
# locally
bun run server.ts

# with docker
docker compose up
```

The server listens on `PORT` env var, defaulting to `3000`.

## Stack

- [Bun](https://bun.sh) — runtime and WebSocket server
- TypeScript
- Node `readline` — terminal input handling
- Deployed on [Railway](https://railway.app)