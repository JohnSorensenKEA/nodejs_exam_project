fetch("/api/requests/getRequests")
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("requests-list");
        data.forEach((element) => {
            const divItem = document.createElement("div");

            const divTop = document.createElement("div");
            const divMiddle = document.createElement("div");
            const divBottom = document.createElement("div");

            const requestDeleteBtn = document.createElement("button");

            const requestSubject = document.createElement("span");
            const requestCreatedAt = document.createElement("span");
            const requestEmail = document.createElement("span");
            const requestMessage = document.createElement("p");

            divItem.className = "request-item";

            divTop.className = "request-item-top";
            divMiddle.className = "request-item-middle";
            divBottom.className = "request-item-bottom";

            requestDeleteBtn.className = "request-delete-btn";

            requestSubject.className = "request-subject";
            requestCreatedAt.className = "request-created-at";
            requestEmail.className = "request-email";
            requestMessage.className = "request-message";

            requestDeleteBtn.value = element._id;
            requestDeleteBtn.innerText = "x";

            requestSubject.innerText = element.title;
            requestCreatedAt.innerText = element.createdAt;
            requestEmail.innerText = element.email;
            requestMessage.innerText = element.message;

            divItem.appendChild(divTop);
            divItem.appendChild(divMiddle);
            divItem.appendChild(divBottom);

            divTop.appendChild(requestSubject);
            divTop.appendChild(requestCreatedAt);
            divTop.appendChild(requestDeleteBtn);

            divMiddle.appendChild(requestEmail);

            divBottom.appendChild(requestMessage);

            container.appendChild(divItem);
        });
    })
    .then(() => {
        document.querySelectorAll(".request-delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                fetch("/api/requests/deleteRequest", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: btn.value,
                    }),
                }).then((response) => {
                    if (response.status == 200) {
                        alert("Successfully deleted request");
                        location.reload();
                    } else {
                        alert("Failed to delete request");
                    }
                });
            });
        });
    });
