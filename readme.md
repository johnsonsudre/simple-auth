# simple-auth

## Description

This is a small backend project to exercise a auth approach that uses express, express-session, mongodb, mongoose, bootstrap, bcrypt and ejs.

## How does this work?

Initially the app test if the db contain the root user, if not exist hes is created with the password "123". This user dont modify this name "root" and your role is defined as "root". From user root other users can be created (and removed) with the roles ["admin", "normal"]. Admin users can be create and remove others users too, but hes dont get modify the root user. Normal users only view the list of users.

## Admin page

<img src="./public/screens.png" style="display: block;
  margin-left: auto;
  margin-right: auto;">
<img src="./public/admin-screen.jpg" style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;">

## Getting Started

### Dependencies

```
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "express-session": "^1.17.2",
    "mongoose": "^6.0.11"
```

### Installing

- Download, install and run [NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)
- Clone this project

```
git clone https://github.com/johnsonsudre/simple-auth.git
npm install
```

### Executing program

```
npm start
```

## Help

Feel free to download, change, send issues and pull request

## Authors

Contributors names and contact info

[johnsonsudre](https://github.com/johnsonsudre/)

## License

This project is licensed under the MIT License.

## Acknowledgments

Inspiration, code snippets, etc.

- [Curso DevPleno](https://go.devpleno.com/fsm)
