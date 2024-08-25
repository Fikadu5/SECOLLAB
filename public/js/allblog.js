var search = document.getElementById("search");

function change(event) {
  event.preventDefault(); // Prevent default form submission
  
  var text = document.getElementById("text").value.trim(); // Get and trim the search text

  if (text === "") {
    // Do nothing if the search text is empty
    return;
  } else {
    // Redirect to the search URL
    window.location.href = `http://localhost:3000/blogs/searchblog/${encodeURIComponent(text)}`;
  }
}

search.addEventListener("click", change);
