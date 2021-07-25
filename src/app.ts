import html from './jsx';

const hello = 'hello';
const myComponent = html`
  <div
    class="${hello}"
    onClick=${() => {
      alert(hello);
    }}
  >
    <span>${hello}</span>
    <span></span>
  </div>
`;

document.body.appendChild(myComponent);
