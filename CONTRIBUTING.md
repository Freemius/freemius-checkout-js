# Contributing to Freemius Checkout JS

🎉 Thank you for your interest in contributing to **Freemius Checkout JS**! We
welcome contributions of all kinds, including code, documentation, issues, and
discussions. Please read through these guidelines to ensure a smooth
contribution process. 🎉

## Table of Contents

-   [Code of Conduct](#code-of-conduct)
-   [How Can I Contribute?](#how-can-i-contribute)
    -   [Issues](#issues)
    -   [Pull Requests (PRs)](#pull-requests)
    -   [Feature Request](#feature-request)
-   [Development Workflow](#development-workflow)
-   [Style Guide](#style-guide)
    -   [Prettier Configuration](#prettier-configuration)

## Code of Conduct

By participating in this project, you agree to abide by the
[Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
We aim to create a welcoming and inclusive community where everyone can
contribute, regardless of experience or background.

## How Can I Contribute?

### Issues

If you find a bug or have a feature request, feel free to open an issue. Make
sure to provide enough details to help others understand and reproduce the
issue.

1. Search existing issues before opening a new one to avoid duplicates.
2. Use a clear and descriptive title.
3. If you're reporting a bug, include steps to reproduce the problem, expected
   behavior, and the actual outcome.

### Pull Requests

We encourage you to contribute to the codebase by submitting a pull request
(PR). Here's the process:

1. **Fork the repository**: Fork the repo and clone it to your local machine.
2. **Branch from `develop`**: All contributions should be based on the `develop`
   branch.
    - Run `git checkout develop` and create a new branch with a meaningful name:
        ```bash
        git checkout develop
        git checkout -b feature/new-awesome-feature
        ```
3. **Make your changes**: Write clean, efficient, and well-documented code.
4. **Run tests**: Ensure that all tests pass before submitting.
5. **Submit your PR**: Push your changes to your fork and create a pull request
   against the `develop` branch. Include a detailed description of what your PR
   does and reference related issues if applicable.
    - We will review the PR as soon as possible. You may be asked to make
      revisions based on feedback.

### Feature Request

We welcome ideas and discussions! If you'd like to talk about future
improvements, ideas for new features, or general questions, feel free to start a
[feature request](https://freemius.nolt.io/).

## Development Workflow

1. **Set up the project**:

    - Clone your fork of the repository and install dependencies:
        ```bash
        git clone https://github.com/YOUR-USERNAME/freemius-checkout-js.git
        cd freemius-checkout-js
        npm ci
        ```
    - Create the `.env` file and set the required environment variables:
        ```bash
        cp .env.sample .env.development.local
        ```
        If you're a Freemius team member, you will find it useful to set the
        `VITE_CHECKOUT_BASE_URL` to the internal development URL. See
        [vite documentation](https://vitejs.dev/guide/env-and-mode.html#env-files)
        to learn about how `.env` files are handled.
    - Run the development server:
        ```bash
        npm run dev
        ```
        The development server will start at `http://localhost:5173/`.

2. **Work on your feature or fix**:

    - Make sure to work in your feature branch created from `develop`.
    - Follow the coding standards and practices of the project.

3. **Testing**:

    - Run tests to ensure nothing is broken:
        ```bash
        npm test
        ```
    - Write new tests if you're adding a new feature or fixing a bug.

4. **Running Linters**: Ensure that your code adheres to the project's style
   guide.

    ```bash
    npm run lint
    npm run prettier:check
    ```

    If you do not have Prettier configured to format your code on save, you can
    run `npm run prettier:write` to format your code.

5. **Submit your work**:
    - After your work is complete, create a pull request as outlined above.

## Style Guide

We follow standard **JavaScript** coding conventions and aim to keep our
codebase consistent. Please ensure that your contributions conform to these
standards:

-   Use **ES6** syntax where applicable.
-   Use **4 spaces for indentation**.
-   Write meaningful commit messages.
-   Keep code modular and documented.

### Prettier Configuration

We use **Prettier** to enforce consistent code formatting. The project uses **4
spaces for indentation**. To ensure that your contributions adhere to our style,
please configure Prettier to automatically format your code on save.

-   [PHPStorm](https://www.jetbrains.com/help/phpstorm/prettier.html) extension.
-   [VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    extension.
