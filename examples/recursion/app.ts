import html from '../../src/index';
import jiayou from 'url:./jiayou.gif';

const containerClassName = 'recursion-wrapper';
const $dom = document.createElement('div');
$dom.appendChild(document.createTextNode('이것은 외부에서 만든 Div'));

function render() {
  const $app = document.querySelector('#app');
  const myComponent = html`
    <div class="${containerClassName}">
      ${html` <img src="${jiayou}" alt="woowa-img" /> `}
      ${html` <div>
        <h1>이거도 나오면 대박인데요?</h1>
        ${html`
          <div>여기가 2중인가요? ${html` <div>여기가 3중인가요?</div> `}</div>
        `}
      </div>`}
      ${$dom}
    </div>
  `;
  if ($app) {
    $app.innerHTML = '';
    $app.appendChild(myComponent);
  }
}

render();
