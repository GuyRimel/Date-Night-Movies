<!-- Markdown syntax here: https://www.markdownguide.org/basic-syntax/ -->
<a id="readme-top"></a>
<br />

<div align="center">
  <a href="https://guyrimel.github.io/Portfolio-Site/index.html">
    <img src="img/RLogoNoName.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Date Night Movies (API)</h3>

  <p align="center">
    This is the communication layer (RESTful API) that handles HTTP requests and communicates with a MongoDB database of movie and user data. For details about API endpoints, visit the <a href="https://datenightmovies.herokuapp.com/documentation" target="_blank">documentation</a>.
  </p>
</div>
<br />

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#deployments">Deployments</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#quick-start">Quick Start</a></li>
        <li><a href="#ux-notes">UX Notes</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- SCREENSHOT -->

<img
  alt="Pokedexterity Screenshot"
  src="img/screenshots/screenshot00.png"
  style="height: 16rem; width: auto; padding: 0.25rem; margin: 0.25rem; background-color: #444;"
/>

[Date Night Movies (API) Repository](https://github.com/GuyRimel/Date-Night-Movies)

<!-- KEY FEATURES -->

### Key Features

1. JWT Authentication, password hashing, and secure user logins.
2. View information about movies, genres, and directors.
3. Create a user account with a username and password
3. View information about a user (credentials required)

<!-- BUILT WITH -->

### Built With

- HTML, CSS, JavaScript
- MongoDB
- Express
- Node.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEPLOYMENTS -->
## Deployments

Date Night Movies (API) is currently live and hosted with GitHub Pages. This RESTful API is the communication layer for two Date Night Movies frontend deployments, one developed with React and one developed with Angular.

- [Date Night Movies (API)](https://datenightmovies.herokuapp.com/)

- [Date Night Movies React Frontend](https://datenightmovies.netlify.app/)

- [Date Night Movies Angular Frontend](https://guyrimel.github.io/Date-Night-Movies-Angular/)



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

<!-- PREREQUISITES -->

### Prerequisites

1. Git installed globally
    - To automatically download Git for Windows click here: https://git-scm.com/download/win
    - To install Git for macOS run the following in the Terminal:

    ```sh
    $ git --version
    ```

2. Node Version Manager (NVM) *and* Node.js installed globally
    - To download both Node.js and NPM, it's advised to first download NVM
    - To download the latest version of NVM for Windows, click here: https://github.com/coreybutler/nvm-windows/releases/lastest
    - Then, in the repository, download and run the `nvm-setup.exe` file
    - To download the latest version of NVM for macOS, first install Homebrew by running the following in the Terminal:

    ```sh
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    ```

    - Then, with Homebrew, run the following:

    ```sh
    brew install nvm
    ```

    - Note: With NVM installed, you'll also be able to utilize Node Package Mangager (NPM)
    - Finally, With NVM installed, run the following (Windows or macOS):

    ```sh
    nvm install node
    ```

3. Express installed globally
    - Install Express globally by running:

    ```sh
    npm install express -g
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION -->

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/GuyRimel/Date-Night-Movies.git
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- QUICK START -->

### Quick Start

After installation...

1. Start the Node server locally by running the following:

   ```sh
   npm run start
   ```

2. Now, with [Postman](https://www.postman.com/downloads/), or a similar API platform of choice, you may test the API endpoints found in the [documentation](https://datenightmovies.herokuapp.com/documentation)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- UX NOTES -->

## UX Notes

- You'll need to create an account by sending a `POST` request to the `/users` endpoint with your desired "Username", "Password", "Email", and "Birthday" (ISO date) key/values in a JSON object in the request body.
- Upon successful account creation, the response body will show a JSON Object of the created user.
- Now you can login by sending a `POST` request to the `/login` endpoint with the `Username` and `Password` key/values as parameters (with an empty request body).
- A successful login request will show user data in a JSON object.
- Copy the value found in `token`, then use it in a separate API requests (found in the [documentation](https://datenightmovies.herokuapp.com/documentation)) by pasting it in the Authorization tab, Type: "Bearer Token", Token: `paste token here`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SCREENSHOTS -->
## Screenshots

<img
  src="img/screenshots/screenshot00.png"
  alt="screenshot"
  style="height: 24rem; width: auto; padding: 0.25rem; margin: 0.25rem; background-color: #444;"
/>

<img
  src="img/screenshots/screenshot01.png"
  alt="screenshot"
  style="height: 24rem; width: auto; padding: 0.25rem; margin: 0.25rem; background-color: #444;"
/>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See <a href="LICENSE.txt" target="_blank">`LICENSE.txt`</a> for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
