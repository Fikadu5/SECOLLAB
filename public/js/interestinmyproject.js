var accepts = document.querySelectorAll(".accept");

accepts.forEach((accept) => {
  accept.addEventListener("click", function() {
    var User_id = accept.getAttribute("user-id");
    var project_id = accept.getAttribute("project-id");

    fetch(`http://localhost:3000/projects/acceptinterest/${project_id}/${User_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // add any other necessary headers here
      },
      body: JSON.stringify({}) // include an empty object since you're not passing any data
    })
    .then(response => {
      if (response.ok) {
        accept.textContent = "added to the group";
      } else {
        alert(response.status);
      }
      return response.json();
    })
    .then(data => {
      // handle the response data here
      console.log(data);
    })
    .catch(error => {
      // handle any errors here
      console.error('Error:', error);
    });
  });
});
