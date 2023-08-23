"use strict";
console.log("js is on");

window.addEventListener("load", start);

const jsonData2 =
  "https://try-out-new-data-structure-default-rtdb.firebaseio.com/";

let postz = [];

async function start() {
  console.log("start2 is starting...");

  await updatePostGrid();
  await updateUserGrid();

  document
    .querySelector("#btn-create-post")
    .addEventListener("click", createPostClicked);

  document
    .querySelector("#title-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#title-search")
    .addEventListener("search", inputSearchChanged);
}

// ---------- posts ----------- //

async function getPosts() {
  const response = await fetch(`${jsonData2}/posts.json`);
  const data = await response.json();

  console.log(data);

  const posts = preparePostData(data);
  console.log(posts);
  postz = posts;
  return posts;
}

function preparePostData(dataObject) {
  const anArray = [];

  for (const key in dataObject) {
    const post = dataObject[key];
    post.id = key;
    console.log(post);
    anArray.push(post);
  }
  // console.log("Array: " + anArray);

  return anArray;
}

function showPost(post) {
  const html = /*HTML*/ `
<article class="grid-item">
<img src="${post.image}">
<h2>${post.title}</h2>
<p>${post.uid}</p>
<p>${post.body}</p>
<button class="btn-delete">Delete</button>
<button class="btn-update">Update</button>
</article>`;
  document
    .querySelector("#posts-container")
    .insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#posts-container article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);
  document
    .querySelector("#posts-container article:last-child .btn-update")
    .addEventListener("click", updateClicked);

  function deleteClicked() {
    console.log("delete post clicked");
    document.querySelector("#dialog-delete-post").innerHTML = /*HTML*/ `
      <h2>Do you want to delete this post?</h2> 
      <br />
      <p>${post.title}</p>
      <br />
      <br />
    <form action="" method=dialog" id="delete-post">
      <input type="button" id="btn-no-update" value="CANCEL"/>
      <button id="btn-yes-update">UPDATE</button>
    </form> 
    `;
    document.querySelector("#dialog-delete-post").showModal();
    document
      .querySelector("#btn-yes")
      .addEventListener("click", deletePostClicked);
    document
      .querySelector("#btn-cancel")
      .addEventListener("click", cancelDelete);
  }

  function deletePostClicked(event) {
    console.log(`delete yes clicked`);
    event.preventDefault();
    deletePost(post.id);
  }

  function updateClicked() {
    console.log("update post clicked");
    document.querySelector("#dialog-update-post").innerHTML = /*HTML*/ `
      <h2>Update post:</h2> 
      <p>${post.title}</p>
      <br />
      <br />
    <form action="" method=dialog" id="form-update-post">
    <label for="title-update">Title:</label>
    <input type="text" id="title-update" name="title-update" 
    placeholder="Type a new title" />
    <br />
    <label for="body-update">Desciption:</label>
    <input type="text" id="body-update" name="body-update" 
    placeholder="Type a new desciption" />
    <br />
    <label for="image-update">Image (URL):</label>
    <input type="url" id="image-update" name="image-update" 
    placeholder="Add a new image" />
    <br />
    <br />
      <input type="button" id="btn-no-update" value="CANCEL"/>
      <button id="btn-yes-update">UPDATE</button>
    </form> 
    `;

    document.querySelector("#dialog-update-post").showModal();

    document
      .querySelector("#btn-no-update")
      .addEventListener("click", cancelUpdate);
    document
      .querySelector("#btn-yes-update")
      .addEventListener("click", updateClickedNew);
    // const title = `Updated: ${post.title}`;
    // const body = `Updated: ${post.body}`;
    // const image = `${post.image}`;
    // updatePost(post.id, title, body, image);
  }

  function updateClickedNew(event) {
    event.preventDefault();

    const image = document
      .querySelector("#form-update-post")
      .elements.namedItem("image-update").value;
    const title = document
      .querySelector("#form-update-post")
      .elements.namedItem("title-update").value;
    const body = document
      .querySelector("#form-update-post")
      .elements.namedItem("body-update").value;
    const uid = post.uid;

    updatePost(post.id, image, title, uid, body);
    document.querySelector("#dialog-update-post").close();
  }
}

function cancelUpdate() {
  document.querySelector("#dialog-update-post").close();
}

function cancelDelete() {
  document.querySelector("#dialog-delete-post").close();
}

async function updatePostGrid() {
  const posts = await getPosts();

  document.querySelector("#posts-container").innerHTML = "";

  for (const post of posts) {
    showPost(post);
  }
}

function createPostClicked() {
  console.log("create post clicked");
  const newPost = (document.querySelector(
    "#dialog-create-post"
  ).innerHTML = /*HTML*/ `
 <form action="" method=dialog" id="createNewPost">
      <label for="postTitle">Title:</label>
      <input type="text" id="postTitle" name="postTitle" />
      <br />
      <label for="postBody">Description:</label>
      <input type="text" id="postBody" name="postBody" />
      <br />
      <label for="postImage">Image (URL):</label>
      <input type="url" id="postImage" name="postImage" />
      <br />
      <br />
      <button id="btn-back">Back</button>
      <input type="submit" id="btn-submit" value="Post" />
    </form> 
    `);
  document.querySelector("#dialog-create-post").showModal();
  document.querySelector("#btn-back").addEventListener("click", closePostModal);

  clickPost(newPost);
}

function closePostModal(event) {
  event.preventDefault();
  document.querySelector("#dialog-create-post").close();
}

function clickPost() {
  document
    .querySelector("#createNewPost")
    .addEventListener("submit", createPostNew);
}

function createPostNew(event) {
  console.log("'Post' clicked");
  event.preventDefault();

  const image = document
    .querySelector("#createNewPost")
    .elements.namedItem("postImage").value;
  const title = document
    .querySelector("#createNewPost")
    .elements.namedItem("postTitle").value;
  const body = document
    .querySelector("#createNewPost")
    .elements.namedItem("postBody").value;
  const uid = Math.floor(Math.random() * 100 + 1);

  createPost(image, title, uid, body);
}

async function createPost(image, title, uid, body) {
  const newPost = {
    image,
    title,
    uid,
    body,
  };
  console.log(newPost);
  const json = JSON.stringify(newPost);

  const response = await fetch(`${jsonData2}/posts.json`, {
    method: "POST",
    body: json,
  });
  console.log(response);

  if (response.ok) {
    console.log("new post has been created - YAY!");
    updatePostGrid();
    document.querySelector("#dialog-create-post").close();
  } else {
    console.error("oh no.. couldn't create a new post :(");
  }
}

async function deletePost(id) {
  const response = await fetch(`${jsonData2}/posts/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("post deleted succesfully from database");
    document.querySelector("#dialog-delete-post").close();
    updatePostGrid();
  } else {
    console.log("something went wrong when trying to delete the post :(");
  }
}

async function updatePost(id, image, title, uid, body) {
  const postToUpdate = { title, body, uid, image };
  const json = JSON.stringify(postToUpdate);
  const response = await fetch(`${jsonData2}/posts/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("post succesfully updated in the database");
    updatePostGrid();
  }
}

// ------------ user --------------- //

async function getUsers() {
  const response = await fetch(`${jsonData2}/users.json`);
  const data = await response.json();

  const users = prepareUserData(data);
  return users;
}

function prepareUserData(dataObject) {
  const anArray = [];

  for (const key in dataObject) {
    const user = dataObject[key];
    user.id = key;
    // console.log(post);
    anArray.push(user);
  }
  console.log("Array: " + anArray);

  return anArray;
}

function showUser(user) {
  document.querySelector("#users-container").insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
<article class="grid-item">
<img src="${user.image}">
<p>${user.name}</p>
<h2>${user.title}</h2>
<p>${user.phone}</p>
<p>${user.mail}</p>
<button class="btn-delete">Delete</button>
<button class="btn-update">Update</button>
</article>`
  );

  document
    .querySelector("#users-container article:last-child .btn-update")
    .addEventListener("click", updateClicked);
  document
    .querySelector("#users-container article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);

  function deleteClicked() {
    console.log("delete user clicked");
    deleteUser(user.id);
  }

  function updateClicked() {
    console.log("update user clicked");
    const image = `${user.image}`;
    const name = `Updated: ${user.name}`;
    const title = `Updated: ${user.title}`;
    const phone = `Updated: ${user.phone}`;
    const mail = `Updated: ${user.mail}`;

    updateUser(user.id, image, name, title, phone, mail);
  }
}

async function updateUserGrid() {
  const users = await getUsers();

  document.querySelector("#users-container").innerHTML = "";

  for (const user of users) {
    showUser(user);
  }
}

async function deleteUser(id) {
  const response = await fetch(`${jsonData2}/users/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("user deleted succesfully");
    updateUserGrid();
  } else {
    console.log("oh no.. something went wrong when trying to delete user :(");
  }
}

async function updateUser(id, image, name, title, phone, mail) {
  const userToUpdate = { image, name, title, phone, mail };
  const json = JSON.stringify(userToUpdate);
  const response = await fetch(`${jsonData2}/users/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("user updated succesfully in the database");
    updateUserGrid();
  } else {
    console.log("something went wrong when trying to update user :(");
  }
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const postsToShow = searchPosts(value);
  showPost(postsToShow);
  console.log(value);
  console.log(postsToShow);
}

function searchPosts(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = postz.filter(checkTitle);
  // lav posts som let variabel i starten og gem i den fir at få det frem eller nesting
  // lav ny func showPosts() som ikke bruger insertAdjecentHTML

  function checkTitle(post) {
    const title = post.title.toLowerCase();
    return title.includes(searchValue);
  }
  return results;
}
