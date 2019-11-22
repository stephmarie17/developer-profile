const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile)

function promptUser() {
    return inquirer.prompt([
        {
            type: 'input',
            message: "Enter your GitHub username:",
            name: "username"  
            },
            {
            type: 'input',
            message: "What is your favorite color?",
            name: "fave-color"
        }
    ])
};

function renderHTML(res) {
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Document</title>
    </head>
    <body>
        <div class="jumbotron jumbotron-fluid">
        <div class="container" style="background-color: ${fave-color}">
            <h1 class="display-4">Hi! My name is ${res.data.name}</h1>
            <p class="lead">I am from ${res.data.location}.</p>
            <img class="thumbnail" src="${res.data.avatar_url}" alt="Bio Image">
            <p>${res.data.bio}</p>
            <h3>My Work</h3>
            <ul class="list-group">
                <li class="list-group-item"><a href="${res.data.html_url}">GitHub</a></li>
                <li class="list-group-item"><a href="#">My Blog</a></li>
            </ul>
            <h3>My GitHub Stats</h3>
            <ul class="list-group">
                <li class="list-group-item">Public Repositories: ${res.data.public_repos}</li>
                <li class="list-group-item">Followers: </li>
                <li class="list-group-item">Following: </li>
                <li class="list-group-item">Stars: </li>
            </ul>
        </div>
        </div>
    </body>
    </html>`;
};


function init(){
    promptUser().then(async function({username}) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios.get(queryUrl)
        .then(async function(res){
            try {
                console.log(res.data);
                const html = renderHTML(res);
                await writeFileAsync("index.html", html)
                console.log("Index.html successfully created!");
            } catch(err) {
                console.log(err);
            }
        });
    });
};

init();
