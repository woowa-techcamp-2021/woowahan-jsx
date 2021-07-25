import html from './jsx';

const hello = 'hello';
const world = 'world';

const myComponent = html`
  <div
    class="${hello}"
    onClick=${() => {
      alert(hello);
    }}
  >
    <span>${hello} ${world}</span>
    <span></span>
  </div>
`;

document.body.appendChild(myComponent);
