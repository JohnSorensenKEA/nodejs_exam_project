async function  init2 () {
    let userProfiles = undefined;

    await fetch("/getUserProfiles")
    .then(response => response.json())
    .then(data => {
        userProfiles = data;
    });

    const container = document.getElementById("message-container");

    fetch("/getRecentMessages")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const divEl = document.createElement("div");
            const nameP = document.createElement("P");
            const messageP = document.createElement("p");
            nameP.className = "name-p";
            messageP.className = "message-p";

            messageP.innerText = element.text;

            for(let i = 0; i < data.length; i++){
                if (data[i].id === element.id){
                    nameP.innerText = data[i].username;
                } 
            }

            divEl.appendChild(nameP);
            divEl.appendChild(messageP);

            container.appendChild(divEl);
        });
    });

    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit("chat message", {message: input.value, id: 0});
            input.value = '';
        }
    });

    socket.on("new message", (message) =>{
        const divEl = document.createElement("div");
            const nameP = document.createElement("P");
            const messageP = document.createElement("p");
            nameP.className = "name-p";
            messageP.className = "message-p";

            messageP.innerText = message.message;

            for(let i = 0; i < data.length; i++){
                if (data[i].id === message.id){
                    nameP.innerText = data[i].username;
                } 
            };

            divEl.appendChild(nameP);
            divEl.appendChild(messageP);

            container.appendChild(divEl);
    });
}