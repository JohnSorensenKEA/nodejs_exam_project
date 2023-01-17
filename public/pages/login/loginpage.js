function init2() {
    document.getElementById("button").addEventListener("click", function() {
        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            mode: 'cors',
            body: JSON.stringify({
                userDetail: {
                    username: document.getElementById("username").value,
                    password: document.getElementById("password").value
                } 
            })
        };

        fetch("/loginRequest", options)
        .then(response => response.json())
        .then(data => {
            const warn = document.getElementById("warning");
            warn.innerHTML = data.message;
            warn.hidden = false;
            
            if(data.status === 200){
                setTimeout(function() {
                    window.location.href = "/pinboard";
                }, 3000);
            }
        })
    });
};