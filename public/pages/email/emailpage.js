document.getElementById("send-btn").addEventListener("click", () => {
    fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: document.getElementById("title").value,
            message: document.getElementById("message").value,
        }),
    }).then((response) => {
        if (response.status == 201) {
            alert("Succesfully sent email(s)");
            document.getElementById("title").value = "";
            document.getElementById("message").value = "";
        } else if (response.status == 500) {
        } else if (response.status == 503) {
        }
    });
});

//Gets user profiles, fills list div
fetch("/getUserProfiles")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        const list = document.getElementById("user-list");

        data.forEach((profile) => {
            const label = document.createElement("label");
            label.className = "user-row";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = profile.id;
            checkbox.name = "users";

            const span = document.createElement("span");
            span.innerText = profile.username;

            label.appendChild(checkbox);
            label.appendChild(span);
            list.appendChild(label);
        });
    });
