function init() {
    document.getElementById("logout-a").addEventListener('click', function() {
        fetch("/logout")
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            setTimeout(function() {
                window.location.href = "/login";
            }, 2000)
        });
    });

    const nonLoggedInElement = document.getElementById("not-logged-in");
    const loggedInElement = document.getElementById("logged-in");

    fetch("/checkLoggedIn")
    .then(response => response.json())
    .then(answer => {
        if(answer){
            nonLoggedInElement.hidden = true;
            loggedInElement.hidden = false;
        }
    });

    if(init2 !== undefined){
        init2();
    }
};

window.onload = init;