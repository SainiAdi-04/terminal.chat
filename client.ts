import readline from "readline"

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const socket = new WebSocket("ws://localhost:3000");

const username = process.argv[2] ?? "Anonymous"

r1.on("line", (input)=>{
    console.log(`you: ${input}`)
    socket.send(JSON.stringify({user:username, text:input}))
})

socket.addEventListener("message", (event)=>{

    console.log(event.data)
})

socket.addEventListener("open",event=>{
    console.log("Server connected")
})

socket.addEventListener("close", event=>{
    console.log("Disconnected from the server")
})

socket.addEventListener("error", event => {
    console.log("error",event)
});