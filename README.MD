# Modular monolith example node.js app

## Architecture

Modular monolith, using transactional outbox.
Modules can communicate synchronously via direct calls to ...
Shared components in shared.

## App

Currently a pretty nonsensical zoo app. Animals can be created in the animals module, which also adds a record in Food module.

## Todo

- use TaskEithers instead of Promises
- add tests and test environment, integration and unit envs & runners
- rename files with component type
- improve application example
- add auth