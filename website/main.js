console.log("Main.js is running!");

const date = new Date();
const year = date.getFullYear();

const massive = document.getElementById("massive");
massive.innerText = massive.innerText.slice(0, -1) + `, even in ${year})`;
