# Back Office for UFE application

[![Author](http://img.shields.io/badge/author-@rfadhlaoui-blue.svg)](https://tn.linkedin.com/in/fadhlaouiraed)

Back office Developed with React.js, Redux, and ant design for UFE application

## Lighthouse

![image](https://github.com/Orange-Digital-Center-Tunisia/ufe-admin/blob/main/src/assets/lighthouse/performance.png)

## Features

- Authentication and Authorization
- Role Manage
- Update Activate/Disable User Account
- Activate, forgot or reset Password
- ES6
- React Router
- Auto watcher for JS and CSS files
- Atomic design project structure
- Launch server with hot-reload using webpack
- Linting with [Eslint](https://eslint.org/).

## Software Requirements

- Node.js **14+**

### Engines

- node **>=14.16.0 <=16.13.0**
- npm **>=6.14.11 <=8.1.0**

## How to install

### Using Git (recommended)

1.  Clone the project from github.

```bash
git clone https://github.com/Orange-Digital-Center-Tunisia/ufe-admin.git
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd ufe-admin
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## How to run

### Running API server locally

```bash
npm run develop
```

You will know server is running by checking the output of the command `npm run develop`

```bash
Connected to the database:YOUR_DB_CONNECTION_STRING
App is running ...

Press CTRL + C to stop the process.
```

## ESLint

### Running Eslint

```bash
npm run lint:check
```

You can set custom rules for eslint in `.eslintrc.json` file, Added at project root.

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
