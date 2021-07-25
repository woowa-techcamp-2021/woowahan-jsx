# woowahan-jsx

Yet Another Simple JSX using tagged template

## 장점

스트링 말고 함수나 객체를 넘길 수 있어요!! ^0^

Prettier로 포매팅이 자동으로 됩니다.

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
  const $app = document.querySelecotr('#app');
  const myComponent = html`
    <div class="${containerClassName}">
      <button
        class="btn"
        onClick=${() => {
          setCounter(state.counter + 1);
        }}
      >
        +
      </button>
      <button
        class="btn"
        onClick=${() => {
          setCounter(state.counter - 1);
        }}
      >
        -
      </button>
      <span>${state.counter}</span>
    </div>
  `;
  $app.innerHTML = '';
  $app.appendChild(myComponent);
}

render();
```

## Install

/src/jsx.ts를 copy & paste 해서 쓰세요!

/src/jsx.js를 copy & paste 해서 쓰세요!
