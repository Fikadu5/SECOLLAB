const likebutton = document.getElementById("like");
const likeCountElement = document.getElementById("numlike");
let likecount = parseInt(likeCountElement.textContent);
const id = likebutton.getAttribute("blog-id");



fetch('http://localhost:3000/blogs/checklike/' + id, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // add any other necessary headers here
  },
  body: JSON.stringify({}) // include an empty object since you're not passing any data
})
.then(response => {
  if (response.status === 200) {
  
    likebutton.style.color = "blue";

  } else if (response.status === 201) {
    likebutton.style.color = "grey";

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















likebutton.addEventListener("click", () => {

  fetch('http://localhost:3000/blogs/addorremovelike/' + id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // add any other necessary headers here
    },
    body: JSON.stringify({}) // include an empty object since you're not passing any data
  })
  .then(response => {
   
    if (response.status === 200) {
      likecount--;
      likebutton.style.color = "grey";
      likeCountElement.textContent = likecount.toString();
    } else if (response.status === 201) {
      likebutton.style.color = "blue";
      likecount++;
      likeCountElement.textContent = likecount.toString();
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