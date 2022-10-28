## Thoughts & context

### Tech choices

I've used the opportunity of this test to try a few technos I had never used before, and had quite some fun. This includes:
- NestJS: never tried it before, but looks very cool for building REST APIs
- SQLite: came across it a few times in CTFs, but never used it as a dev. Pretty neat as well, gets one started quickly

### Challenging the specs

TODO

### Keeping it real

Because of time constraints (and a busy schedule), I've tried to stay pragmatic and optimize. For instance, there may be some missing tests, but I tried to put the effort where the impact would be the greatest. For example, I focused on testing what would bring the most significant - and relevant - coverage, not every single thing.

Also, there's always a lot of room for improvement - but I've tried to find a decent quality compromise.

### Database

The exercise didn't specify any storage mechanism, but I wanted to go with a SQL database to make it a little bit more realistic (as opposed to in-memory JS code). I kept it super simple with an SQLite db. Note that I haven't added indexes given the simplicity of the exercise, but on a real-world application, it would definitely make sense to index the email or token fields of the tokens table, for example.

Also, it's an in-memory database, so of course at each deploy all data is lost. It wouldn't make sense for a real-life application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests + e2e tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

Documentation can be accessed at path `/doc`. Documentation comes with examples that can be executed (for testing purposes).

## TODO

- Requests in text/plain
- Check test coverage
- Pre-commit hooks