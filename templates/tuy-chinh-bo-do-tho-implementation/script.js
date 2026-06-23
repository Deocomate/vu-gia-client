const currency = new Intl.NumberFormat('vi-VN');
let zoom = 100;

const totalPrice = document.querySelector('#totalPrice');
const selectedItems = document.querySelector('#selectedItems');
const zoomValue = document.querySelector('#zoomValue');

function formatMoney(value) {
  return `${currency.format(value)}đ`;
}

function getItemText(name, qty) {
  return `${qty} x ${name}`;
}

function getItemKey(name, unitPrice) {
  return `${name.trim().toLowerCase()}::${unitPrice}`;
}

function parseQuantityAndName(text) {
  const match = text.trim().match(/^(\d+)\s*x\s*(.+)$/i);
  if (!match) return { qty: 1, name: text.trim() };
  return { qty: Number(match[1]) || 1, name: match[2].trim() };
}

function normalizeSummaryItem(li) {
  const label = li.querySelector('span')?.textContent || 'Sản phẩm';
  const { qty, name } = parseQuantityAndName(label);
  const linePrice = Number(li.dataset.price || 0);
  const unitPrice = Number(li.dataset.unitPrice || Math.round(linePrice / Math.max(qty, 1)) || linePrice);

  li.dataset.name = name;
  li.dataset.qty = String(qty);
  li.dataset.unitPrice = String(unitPrice);
  li.dataset.price = String(unitPrice * qty);
  li.dataset.key = getItemKey(name, unitPrice);

  const removeButton = li.querySelector('button');
  if (removeButton && !removeButton.dataset.bound) {
    removeButton.dataset.bound = 'true';
    removeButton.addEventListener('click', () => {
      li.remove();
      updateTotalFromItems();
    });
  }
}

function updateSummaryItem(li) {
  const name = li.dataset.name || 'Sản phẩm';
  const qty = Number(li.dataset.qty || 1);
  const unitPrice = Number(li.dataset.unitPrice || 0);
  const linePrice = qty * unitPrice;

  li.dataset.price = String(linePrice);
  const label = li.querySelector('span');
  const price = li.querySelector('b');
  if (label) label.textContent = getItemText(name, qty);
  if (price) price.textContent = formatMoney(linePrice);
}

function updateTotalFromItems() {
  const total = [...selectedItems.querySelectorAll('li')].reduce((sum, li) => {
    return sum + Number(li.dataset.price || 0);
  }, 0);
  totalPrice.textContent = `${currency.format(total)} đ`;
}

function addSummaryItem(name, unitPrice) {
  const key = getItemKey(name, unitPrice);
  let li = [...selectedItems.querySelectorAll('li')].find((item) => item.dataset.key === key);

  if (li) {
    li.dataset.qty = String(Number(li.dataset.qty || 1) + 1);
    updateSummaryItem(li);
    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }

  li = document.createElement('li');
  li.dataset.name = name;
  li.dataset.qty = '1';
  li.dataset.unitPrice = String(unitPrice);
  li.dataset.price = String(unitPrice);
  li.dataset.key = key;
  li.innerHTML = `<span>${getItemText(name, 1)}</span><b>${formatMoney(unitPrice)}</b><button type="button" aria-label="Xóa ${name}"></button>`;

  li.querySelector('button').addEventListener('click', () => {
    li.remove();
    updateTotalFromItems();
  });

  selectedItems.appendChild(li);
  li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

selectedItems.querySelectorAll('li').forEach(normalizeSummaryItem);
updateTotalFromItems();

document.querySelectorAll('.add-item').forEach((button) => {
  button.addEventListener('click', () => {
    const price = Number(button.dataset.price || 0);
    const name = button.dataset.name || 'Sản phẩm';
    addSummaryItem(name, price);
    updateTotalFromItems();
    button.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.96)' }, { transform: 'scale(1)' }],
      { duration: 180, easing: 'ease-out' }
    );
  });
});

document.querySelectorAll('.tab-button').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach((item) => item.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

document.querySelector('#zoomIn')?.addEventListener('click', () => {
  zoom = Math.min(150, zoom + 10);
  zoomValue.textContent = `${zoom}%`;
});

document.querySelector('#zoomOut')?.addEventListener('click', () => {
  zoom = Math.max(50, zoom - 10);
  zoomValue.textContent = `${zoom}%`;
});

document.querySelector('.exit-button')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
