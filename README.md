# Prototype of TUMSocial Event Plattform

## Description
TUMSocial is an innovative event platform designed to connect TUM students with various social
opportunities across the university by centralizing information about relevant events, encouraging
engagement and facilitating participation in a wide range of social and professional activities.

## Installation

### Clone Repository
```
cd existing_repo
git remote add origin https://gitlab.lrz.de/seba-master-2024/team-21/prototype.git
git branch -M main
git push -uf origin main
```
### Install Backend Dependencies and run Backend Server
```
cd backend
npm install
npm run dev-backend
```

### Install Frontend Dependencies and run Frontend
```
cd frontend
npm install
npm run dev-fronted //or npx vite
```

## Usage

Go initialize project in Docker:

Go to directory \prototype and execute the following command: "docker-compose up"

To visit the site, please go to [TUMSocial](http://localhost:5010/) (http://localhost:5010/) after executing the docker-compose file.

Admin account:
    username: seba.team21@gmail.com
    password: admin

Student account:
    
    Feel free to create you own account

    Please use an existing email address to ensure receiving emails for the password reset

    Example account:

    username: daniel.taylor@tum.de
    password: muqZoq-8vijlo-pihwoh!

Company account:

    Example account:
    
    username: olivia.white@siemens.de
    password: ruwVip-7fijho-puzkoh!



## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
**Team 21:** Maximilian Hau, Vincent Derek Held, Natalia Milanova, Alexander Tambunan

## License
For open source projects, say how it is licensed.

## Project status
Ths project is currently developed.

