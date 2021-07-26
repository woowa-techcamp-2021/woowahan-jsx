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
      hello
      ${html`
        <img
          src="${baemin}"
          alt="woowa-img"
          onClick=${() => {
            alert('hello');
          }}
        />
      `}
      hi ${html` <img src="${baemin}" alt="woowa-img" /> `} bye
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
      ${html` <div>
        <h1>이거도 나오면 대박인데요?</h1>
        ${html`
          <div>
            여기가 2중인가요?
            ${html`
              <div>
                여기가 3중인가요?
                <input
                  type="text"
                  onInput=${(e: any) => console.log(e.target.value)}
                />
              </div>
            `}
          </div>
        `}
      </div>`}
    </div>
  `;
  if ($app) {
    $app.innerHTML = '';
    $app.appendChild(myComponent);
  }
}

render();
