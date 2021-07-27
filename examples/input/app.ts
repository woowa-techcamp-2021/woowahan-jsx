import html from '../../src/jsx';
import baemin from 'url:./jiayou.gif';

const state = {
  text: '',
};

const inputHandler = (ev: InputEvent) => {
  state.text = (ev.target as any).value;
  const $display = document.querySelector('#display');
  if ($display) {
    $display.textContent = state.text;
  }
};

const containerClassName = 'input-wrapper';

function render() {
  const $app = document.querySelector('#app');
  const myComponent = html`
    <div class="${containerClassName}">
      ${html` <img src="${baemin}" alt="woowa-img" /> `}
      <input
        type="text"
        placeholder="아무거나 입력하세요"
        onInput=${inputHandler}
      />
      <span id="display">${state.text}</span>
    </div>
  `;
  if ($app) {
    $app.innerHTML = '';
    $app.appendChild(myComponent);
  }
}

render();
