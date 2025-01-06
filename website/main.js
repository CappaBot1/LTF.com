console.log("Why are you looking in the console?");

const date = new Date();
const year = date.getFullYear();

const massive = document.getElementById("massive");
massive.innerText = massive.innerText.slice(0, -1) + `, even in ${year})`;
