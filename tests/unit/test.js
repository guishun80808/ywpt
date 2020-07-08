const test = '1';

const arr = (e) => {
  let i = 0;
  i++;
  console.log (i);
  return e;
};

function a () {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push (i);
  }
  return arr;
}

arr (2);
console.log (test);
