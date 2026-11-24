fetch("/getRecentMessages/5")
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("messages-div");
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
        const container = document.getElementById("messages-div");
        container.scrollTop = container.scrollHeight;
    });

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
