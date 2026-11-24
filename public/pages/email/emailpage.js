const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

fetch("/api/email/getEmail/" + id)
    .then((response) => response.json())
    .then((data) => {
        const emailViewSubject = document.getElementById("email-view-subject");
        const emailViewDatetime = document.getElementById("email-view-datetime");
        const emailViewSystemMessage = document.getElementById("email-view-system-message");
        const emailViewBody = document.getElementById("email-view-body");

        emailViewSubject.innerText = data.subject;
        emailViewDatetime.innerText = data.created_at;
        emailViewSystemMessage.innerText = data.system_message;
        emailViewBody.innerText = data.body;
    });

fetch("/api/email/getRecipients/" + id)
    .then((response) => response.json())
    .then((data) => {
        const emailViewRec = document.getElementById("email-view-recipients");
        
        data.forEach((profile) => {
            const recSpan = document.createElement("span");
            recSpan.className = "email-recipient";
            recSpan.innerText = `${profile.username} (${profile.member_number}) - ${profile.email}`;
            emailViewRec.appendChild(recSpan);
        })
    });

document.getElementById("email-view-delete-button").addEventListener("click", () => {
    fetch("/api/email/deleteEmail", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
        }),
    }).then((response) => {
        if (response.status == 200) {
            alert("Successfully deleted email");
            window.location.href = "/emails";
        } else {
            alert("Deletion of email failed");
        }
    });
});
