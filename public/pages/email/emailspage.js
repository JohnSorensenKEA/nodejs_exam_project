fetch("/api/email/getEmails")
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("email-list");
        data.forEach((element) => {
            container.appendChild(
                createEmailDiv(
                    element.id,
                    element.subject,
                    element.body,
                    element.system_message,
                    element.created_at,
                    element.reference_count,
                ),
            );
        });
    });

function createEmailDiv(
    id,
    subject,
    body,
    system_message,
    createdAt,
    referenceCount,
) {
    const itemLink = document.createElement("a");
    const divItem = document.createElement("div");

    const divTop = document.createElement("div");
    const divMiddle = document.createElement("div");
    const divBottom = document.createElement("div");

    const emailSubject = document.createElement("span");
    const emailCreatedAt = document.createElement("span");
    const emailReferenceCount = document.createElement("span");
    const emailBodyPreview = document.createElement("p");

    itemLink.className = "email-item-link";
    divItem.className = "email-item";

    divTop.className = "email-item-top";
    divMiddle.className = "email-item-middle";
    divBottom.className = "email-item-bottom";

    emailSubject.className = "email-subject";
    emailCreatedAt.className = "email-created-at";
    emailReferenceCount.className = "email-ref-count";
    emailBodyPreview.className = "email-body-preview";

    itemLink.href = `/email?id=${id}`;
    emailSubject.innerText = subject;
    emailCreatedAt.innerText = createdAt;
    emailReferenceCount.innerText = `Recipients: #${referenceCount}`;
    emailBodyPreview.innerText = body;

    itemLink.appendChild(divItem);

    divItem.appendChild(divTop);
    divItem.appendChild(divMiddle);
    divItem.appendChild(divBottom);

    divTop.appendChild(emailSubject);
    divTop.appendChild(emailCreatedAt);

    divMiddle.appendChild(emailReferenceCount);

    divBottom.appendChild(emailBodyPreview);

    return itemLink;
}
