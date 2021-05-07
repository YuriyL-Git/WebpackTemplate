import './assets/SCSS/style.scss';


// import add from './assets/scripts/post';
const button = document.querySelector('button')!;
let index = 1;

button.addEventListener('click', () => {
  index++;
  console.log(index);
});

function add(n1: number, n2: number) {
  return n1 + n2;
}

console.log(add(2, 2));

