const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const open = require('open');
const convertFactory = require('electron-html-to');
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
    });



const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: 'input',
            message: "Enter your GitHub username:",
            name: "username"  
            },
            {
            // need to figure out how to store color input
            type: 'input',
            message: "What is your favorite color?",
            name: "favecolor"
        }
    ])
};

function generateHTML(answers, color) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Developer Profile</title>
    </head>
    <style>
        body, .background_color, .jumbotron {
            background-color: ${color}
        }
        body {
            width:100%;
            height:100%;
        }
        a {
            color: #232323;
        }
    </style>
    <body>
        <div class="jumbotron jumbotron-fluid">
        <div class="container px-10px py-20px background_color">
            <h1 class="display-4">Hi! My name is ${answers.name}</h1>
            <p class="lead">I am from <a href="https://google.com/maps/place/${answers.location}/">${answers.location}</a>.</p>
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
                <li class="list-group-item"><a href="${answers.blog}" class="alert-link">My Blog</a></li>
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
    //Check process.argv if correct args execute
    promptUser().then(async function({username, favecolor}) {
        const queryUrl = `https://api.github.com/users/${username}`;
        axios.get(queryUrl)
        .then(async function(res){
            try {
                const answers = res.data;
                console.log(answers);
                const color = favecolor;
                // once color var works, update the html generate function
                const html = generateHTML(answers, color);
                await writeFileAsync("index.html", html)
                console.log("Index.html successfully created!");
                
                conversion({ html, pdf:{ printBackground: true } }, function(err, result) {
                if (err) {
                    return console.error(err);
                }
                
                console.log(result.numberOfPages);
                console.log(result.logs);
                result.stream.pipe(fs.createWriteStream('developerprofile.pdf'));
                conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                open('developerprofile.pdf')
                });

            } catch(err) {
                console.log(err);
            }
        });
    });
};

init();


