"use strict";

window.addEventListener("load", start);

const jsonData2 =
  "https://try-out-new-data-structure-default-rtdb.firebaseio.com/";

async function start() {
  console.log("start2 is starting...");

  await updatePostGrid();
  await updateUserGrid();

  document
    .querySelector("#btn-create-post")
    .addEventListener("click", createPostClicked);
  // createPost("my title", "https://scontent-cph2-1.xx.fbcdn.net/v/t39.30808-6/341831548_625878382792660_2197200488603256330_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=730e14&_nc_ohc=GB6Ke2F8JI4AX_mHgj8&_nc_ht=scontent-cph2-1.xx&oh=00_AfClqOMRmwKs5wTn65vuRb6fPIOKcuWtazWck3ZNH9W9-A&oe=6443F1A0", "hello world");
}

// ---------- posts ----------- //

async function getPosts() {
  const response = await fetch(`${jsonData2}/posts.json`);
  const data = await response.json();

  console.log(data);

  const posts = preparePostData(data);
  console.log(posts);
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
  console.log("Array: " + anArray);

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
    deletePost(post.id);
    console.log("delete post clicked");
  }

  function updateClicked() {
    console.log("update post clicked");
    const title = `Updated: ${post.title}`;
    const body = `Updated: ${post.body}`;
    const image = `${post.image}`;
    updatePost(post.id, title, body, image);
  }
}

async function updatePostGrid() {
  const posts = await getPosts();

  document.querySelector("#posts-container").innerHTML = "";

  for (const post of posts) {
    showPost(post);
  }
}

function createPostClicked() {
  const number = Math.floor(Math.random() * 100 + 1);
  // let newNumber = 0;
  // newNumber = newNumber+1;
  // for (let i = 0; i < 100; i++) {
  //   console.log(i);
  // }
  const image =
    "https://scontent-cph2-1.xx.fbcdn.net/v/t39.30808-6/341831548_625878382792660_2197200488603256330_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=730e14&_nc_ohc=GB6Ke2F8JI4AX_mHgj8&_nc_ht=scontent-cph2-1.xx&oh=00_AfClqOMRmwKs5wTn65vuRb6fPIOKcuWtazWck3ZNH9W9-A&oe=6443F1A0";
  const title = `New post ${number}`;
  const uid = ``;
  const body = `Hello world, this is a new post`;

  createPost(image, title, uid, body);
}

async function createPost(image, title, uid, body) {
  const newPost = {
    image,
    title,
    uid,
    body,
    // title: title,
    // image: image,
    // body: body,
    // uid: uid,
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
  } else {
    console.log("oh no.. couldn't create a new post :(");
  }
  // const data = await response.json();
  // console.log(data);

  // document
  //   .querySelector("#posts-container")
  //   .insertAdjacentHTML("beforebegin", ????);
}

async function deletePost(id) {
  const response = await fetch(`${jsonData2}/posts/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("post deleted succesfully from database");
    updatePostGrid();
  } else {
    console.log("something went wrong when trying to delete the post :(");
  }
}

async function updatePost(id, title, body, image) {
  const postToUpdate = { title, body, image };
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
