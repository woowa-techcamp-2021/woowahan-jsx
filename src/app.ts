import html from './jsx';
import baemin from 'url:./jiayou.gif';

const state = {
  counter: 0,
};

const setCounter = (val: number) => {
  state.counter = val;
  render();
};

const containerClassName = 'counter-wrapper';

function render() {
  const $app = document.querySelector('#app');
  const myComponent = html`
    <div class="${containerClassName}">
      <img src="${baemin}" alt="woowa-img" />
      <div>
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
    </div>
  `;
  if ($app) {
    $app.innerHTML = '';
    $app.appendChild(myComponent);
  }
}

render();
