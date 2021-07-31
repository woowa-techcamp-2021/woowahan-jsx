<h1 align="center"> 우아한 JSX </h1>

<p align="center">Yet Another Simple JSX using tagged template</p>

<p align="center"><b>언어의 한계가 곧 세계의 한계다</b> - Ludwig Wittgenstein</p>

<p align="center"> 우아한 JSX가 <b>캠퍼들의 표현의 자유를 넓히고 세계를 넓히는데 도움이 되었으면 합니다</b> </p>

## Example

```ts
import html from './src/jsx';

const state = {
  counter: 0,
};

const setCounter = val => {
  state.counter = val;
  render();
};

const containerClassName = 'counter-wrapper';

function render() {
  const $app = document.querySelector('#app');
  // myComponent는 HTMLElement 타입입니다.
  const myComponent = html`
    <div class="${containerClassName}">
      <button
        class="btn"
        onClick=${() => {
          setCounter(state.counter - 1);
        }}
      >
        -
      </button>
      <span>${state.counter}</span>
      <button
        class="btn"
        onClick=${() => {
          setCounter(state.counter + 1);
        }}
      >
        +
      </button>
    </div>
  `;
  $app.innerHTML = '';
  $app.appendChild(myComponent);
}

render();
```

![counter](https://user-images.githubusercontent.com/13645032/127169158-e832a11c-1624-44b5-9f94-e2b38312facc.gif)

## 장점

Prettier로 포매팅이 자동으로 됩니다.

스트링뿐만 아니라 함수나 DOM도 ${}에 넘길 수 있어요!! ^0^

onClick이나, onInput 같은 콜백 함수를 넘겨보세요. [click 예제](./examples/counter/app.ts), [input 예제](./examples/input/app.ts)

Child Component도 지원 합니다! ${} 안에다가 DOM Object 넣으면 렌더링 돼요! [예제](./examples/recursion/app.ts)

Child Component List 됩니다. Map 함수 써서 리액트 JSX 처럼 쓸 수 있어요. [예제](./examples/dom-list/app.ts)

## Install

[타입스크립트 코드](./src/jsx.ts)를 copy & paste 해서 쓰세요!

[babel-6용 자바스크립트 코드](./src/jsx.js)를 copy & paste 해서 쓰세요!

[babel-7용 자바스크립트 코드](./src/jsx-corejs2.js) copy & paste 해서 쓰세요
