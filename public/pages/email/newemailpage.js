document.getElementById("send-btn").addEventListener("click", () => {
    const checkedInputs = [
        ...document.querySelectorAll("#user-list input[type=checkbox]:checked"),
    ];
    const checkedIds = checkedInputs.map((input) => Number(input.value));

    if (checkedIds.length == 0) {
        alert("Please select one or more recipients");
        return;
    };

    const subject = document.getElementById("email-subject-input").value;
    if (subject == "") {
        alert("Please add a subject");
        return;
    };

    const body = document.getElementById("email-body").value;
    if (body == "") {
        alert("Please add a message");
        return;
    }

    fetch("/api/email/newEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: subject,
            message: body,
            userIds: checkedIds,
        }),
    }).then((response) => {
        if (response.status == 201) {
            alert("Succesfully sent email(s)");
            document.getElementById("email-subject-input").value = "";
            document.getElementById("email-body").value = "";
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
            span.innerText = profile.username + " (" + profile.member_number + ") - " + profile.email;

            label.appendChild(checkbox);
            label.appendChild(span);
            list.appendChild(label);
        });
    });
