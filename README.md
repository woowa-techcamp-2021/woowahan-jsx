# woowahan-jsx

Yet Another Simple JSX using tagged template

## 장점

Prettier로 포매팅이 자동으로 됩니다.

스트링뿐만 아니라 함수나 DOM도 ${}에 넘길 수 있어요!! ^0^

onClick이나, onInput 같은 콜백 함수를 넘겨보세요. [예제](./examples/counter/app.ts)

Child Component도 지원 합니다! ${} 안에다가 DOM Object 넣으면 렌더링 돼요! [예제](./examples/recursion/app.ts)

Child Component List 됩니다. Map 함수 써서 리액트 JSX 처럼 쓸 수 있어요. [예제](./examples/dom-list/app.ts)

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

![counter example](https://user-images.githubusercontent.com/13645032/126922790-edc67f4a-992e-4cb3-a178-28e737796c9e.gif)

## Install

/src/jsx.ts를 copy & paste 해서 쓰세요!

/src/jsx.js를 copy & paste 해서 쓰세요!
