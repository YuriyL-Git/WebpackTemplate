import './assets/SCSS/style.scss';


// import add from './assets/scripts/post';

// eslint-disable-next-line @typescript-eslint/ban-types
function Logger(constructor: Function) {
  console.log('Logging');
  console.log(constructor);
}

@Logger
class Person {
  name = 'max';

  constructor() {
    console.log('Creating object..');
  }
}

