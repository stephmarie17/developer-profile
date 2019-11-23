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
            name: "favecolor"
        }
    ])
};

function generateHTML(answers) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Developer Profile</title>
    </head>
    <body>
        <div class="jumbotron jumbotron-fluid">
        <div class="container px-10px py-20px" style="background-color: pink">
            <h1 class="display-4">Hi! My name is ${answers.name}</h1>
            <p class="lead">I am from ${answers.location}.</p>
        <div class="row">
            <div class="col-md-8">
            <img class="img-thumbnail" style="border-radius:300px" src="${answers.avatar_url}" alt="Bio Image">
            </div>
            <div class="col-md-4">
            <p class="lead">${answers.bio}</p>
            </div>
        </div>
            <div class="alert alert-light" role="alert">
            <h3 class="display-6">My Work</h3>
            <ul class="list-group">
                <li class="list-group-item"><a href="${answers.html_url}" class="alert-link">GitHub</a></li>
                <li class="list-group-item"><a href="#" class="alert-link">My Blog</a></li>
            </ul>
            </div>
            <div class="alert alert-light" role="alert">
            <h3 class="display-6">My GitHub Stats</h3>
            <ul class="list-group">
                <li class="list-group-item">Public Repositories: ${answers.public_repos}</li>
                <li class="list-group-item">Followers: ${answers.followers}</li>
                <li class="list-group-item">Following: ${answers.following}</li>
                <li class="list-group-item"><a href="${answers.starred_url}" class="alert-link">Stars</a></li>
            </ul>
            </div>
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
                const answers = res.data;
                console.log(answers);
                // const color = favecolor;
                const html = generateHTML(answers);
                await writeFileAsync("index.html", html)
                console.log("Index.html successfully created!");
            } catch(err) {
                console.log(err);
            }
        });
    });
};

init();
