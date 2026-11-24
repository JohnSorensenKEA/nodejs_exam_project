async function init2() {
    let userProfiles = undefined;

    await fetch("/getUserProfiles")
        .then((response) => response.json())
        .then((data) => {
            userProfiles = data;
        });

    const container = document.getElementById("message-container");

    fetch("/getRecentMessages")
        .then((response) => response.json())
        .then((data) => {
            data.forEach((element) => {
                container.appendChild(
                    createMessageDiv(
                        element.username,
                        element.text,
                        element.created_at,
                    ),
                );
            });
        })
        .then(() => {
            container.scrollTop = container.scrollHeight;
        });

    const socket = io();

    const form = document.getElementById("form");
    const input = document.getElementById("input");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit("chat message", {
                message: input.value,
            });
            input.value = "";
        }
    });

    socket.on("new message", (message) => {
        container.appendChild(
            createMessageDiv(
                message.username,
                message.message,
                message.created_at,
            ),
        );
    });
}

function createMessageDiv(name, message, time) {
    const divEl = document.createElement("div");
    const nameP = document.createElement("p");
    const messageP = document.createElement("p");
    const timeP = document.createElement("p");

    nameP.className = "name-p";
    messageP.className = "message-p";
    timeP.className = "time-p";

    messageP.innerText = message;
    nameP.innerText = name;
    timeP.innerText = time;

    divEl.appendChild(nameP);
    divEl.appendChild(messageP);
    divEl.appendChild(timeP);

    return divEl;
}
