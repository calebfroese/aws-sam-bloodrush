# AWS Sam Bloodrush

This repository contains the AWS hosted backend for Bloodrush as a [SAM](https://github.com/awslabs/serverless-application-model).

## Prerequisites

- AWS CLI
- SAM CLI
- Node & NPM

## Installation

Install required node modules `$ npm install`.

## Testing

After installing, the test suite can be run with `$ npm test`.
For testing alongside development `$ npm run watch:test` will build and test the project.

## Building

### for Development

Development builds can be created by running `$ npm run build:dev`.
This will compile the Typescript project source and tests with sourcemaps.

### for Production

We are using [Webpack](https://webpack.js.org) to create minified production builds.
You can build for production with `$ npm run build:prod`.
Production builds do not include tests or sourcemaps, and are only the single `lambdas` entrypoint referenced in the SAM template.

## Deployment

`$ npm run deploy` will create a production build and deploy it to AWS.
