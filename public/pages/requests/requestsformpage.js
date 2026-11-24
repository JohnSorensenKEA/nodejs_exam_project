document.getElementById("request-send-btn").addEventListener("click", () => {
    fetch("/api/requests/newRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("request-email").value,
            subject: document.getElementById("request-subject").value,
            message: document.getElementById("request-message").value,
        }),
    }).then((response) => {
        if (response.status == 200) {
            alert("Successfully sent request");
        } else {
            alert(
                "Something went wrong, check your message and/or try again later",
            );
        }
    });
});
