"use strict";

window.addEventListener("load", start);

const jsonData =
  "https://my-first-project-708c7-default-rtdb.europe-west1.firebasedatabase.app";

async function start() {
  console.log("start is starting...");

  const posts = await getPosts();
  for (const post of posts) {
    showPost(post);
  }
//   createPost("my title", "img", "hello world");
}

async function getPosts() {
  const response = await fetch(`${jsonData}/posts.json`);
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
  document.querySelector("#grid-container").insertAdjacentHTML(
    "beforeend",
    /*HTML*/ `
<article class="grid-item">
<img src="${post.image}">
<h2>${post.title}</h2>
<p>${post.body}</p>
</article>`
  );
}

async function createPost(title, image, body) {
  const newPost = {
    title: title,
    image: image,
    body: body,
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
