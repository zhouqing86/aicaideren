# Ai Cai De Ren

## Developer Setup

### Prerequisites

```bash
$ cd project/              
$ nvm use 6.9.1                 
$ sudo npm -g install gulp      
$ npm install
```

设置git hooks:

```bash
echo $'#!/bin/sh\ncd project && gulp test' > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

### Building tasks

`gulp test` unit test.

`gulp test:coverage` test coverage report.

`gulp dist` task will compile the project and pact it into dist/

### Running Locally

`gulp serve`

Then visit [http://localhost:8000](http://localhost:8000)
