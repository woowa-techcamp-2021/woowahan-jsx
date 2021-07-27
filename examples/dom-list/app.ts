import html from '../../src/jsx';
import jiayou from 'url:./jiayou.gif';

const containerClassName = 'dom-list-wrapper';

const TextComponent = (text: string) => {
  return html` <span>${text}</span> `;
};

function render() {
  const $app = document.querySelector('#app');
  const myComponent = html`
    <div class="${containerClassName}">
      ${html` <img src="${jiayou}" alt="woowa-img" /> `}
      ${['안녕하세요', '저는 땡떙땡입니다'].map(s => TextComponent(s))}
    </div>
  `;
  if ($app) {
    $app.innerHTML = '';
    $app.appendChild(myComponent);
  }
}

render();
