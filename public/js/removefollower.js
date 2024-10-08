all_remove = document.querySelectorAll(".allremove");


all_remove.forEach(function(button){
button.addEventListener("click", function() {
    follower_id = button.getAttribute("follower_id");

    fetch("http://127.0.0.1:3000/unfollow/" + follower_id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(function(response) {

        if (response.ok) {

            window.location.href = "http://127.0.0.1:3000/myfollowing";
            return response.json();
        } else {
            throw new Error("Error: " + response.status);
        }
    })
    .then(function(data) {
        if (data && data.message) {
            // Handle message if needed
        } else {
            throw new Error("Invalid response data");
        }
    })
    .catch(function(error) {
        console.error(error);
    });
    });
});
