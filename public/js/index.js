const followButtons = document.querySelectorAll(".follow");


followButtons.forEach(button => {
  
    const id = button.getAttribute("user-id");
    fetch('http://localhost:3000/checkfollowing/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // add any other necessary headers here
      },
      body: JSON.stringify({}) // include an empty object since you're not passing any data
    })
    .then(response => {
      if (response.status === 200) {
        button.textContent = "Following";
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









  followButtons.forEach(button => {
    button.addEventListener("click", () => {
      if(button.textContent == "Follow") {
        const id = button.getAttribute("user-id");
        fetch('http://localhost:3000/follow/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // add any other necessary headers here
          },
          body: JSON.stringify({}) // include an empty object since you're not passing any data
        })
        .then(response => {
          if (response.status === 200) {
            button.textContent = "Followed";
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
      }
      else {
        const id = button.getAttribute("user-id");
        fetch('http://localhost:3000/unfollowuser/' + id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // add any other necessary headers here
          },
          body: JSON.stringify({}) // include an empty object since you're not passing any data
        })
        .then(response => {
          if (response.status === 200) {
            button.textContent = "Follow"; // Update the text to "Follow"
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
      }
    });
  });