"use strict";

window.addEventListener("load", start);

const jsonData2 =
  "https://try-out-new-data-structure-default-rtdb.firebaseio.com/";


async function start() {
  console.log("start2 is starting...");

  const posts = await getPosts();
  for (const post of posts) {
    showPost(post);
  }
  const users = await getUsers();
   for (const user of users) {
     showUser(user);
   }
  //   createPost("my title", "img", "hello world");
}

async function getPosts() {
  const response = await fetch(`${jsonData2}/posts.json`);
  const data = await response.json();

  console.log(data);

  const posts = preparePostData(data);
  console.log(posts);
  return posts;
}

async function getUsers() {
  const response = await fetch(`${jsonData2}/users.json`);
  const data = await response.json();

  const users = prepareUserData(data);
  return users;
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

function showPost(post) {
  document.querySelector("#grid-container").insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
<article class="grid-item">
<img src="${post.image}">
<h2>${post.title}</h2>
<p>${post.uid}</p>
<p>${post.body}</p>
</article>`
  );
}

function showUser(user) {
      document.querySelector("#grid-container").insertAdjacentHTML(
        "beforeend",
        /*HTML*/ `
<article class="grid-item">
<img src="${user.image}">
<p>${user.name}</p>
<h2>${user.title}</h2>
<p>${user.phone}</p>
<p>${user.mail}</p>
</article>`
      );
}

async function createPost(title, image, body, uid) {
  const newPost = {
    title: title,
    image: image,
    body: body,
    uid: uid
  };
  console.log(newPost);
  const postAsJson = JSON.stringify(newPost);

  const response = await fetch(`${jsonData}/posts.json`, {
    method: "POST",
    body: postAsJson,
  });
  console.log(response);
  const data = await response.json();
  console.log(data);
}
