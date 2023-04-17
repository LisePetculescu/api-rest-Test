"use strict";

window.addEventListener("load", start);

const jsonData =
  "https://my-first-project-708c7-default-rtdb.europe-west1.firebasedatabase.app/";

function start() {
  console.log("start is starting...");

  getPosts();
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
