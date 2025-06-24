public/script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript radi!');
  const params = new URLSearchParams(window.location.search);
  const tableNumber = params.get('table') || 'nepoznat';

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.product-row').forEach(row => {
      const price = parseFloat(row.querySelector('.price-box').getAttribute('data-price').replace(',', '.'));
      const count = parseInt(row.querySelector('.count-box').textContent) || 0;
      total += price * count;
    });
    document.getElementById('total-price').textContent = total.toFixed(2).replace('.', ',') + ' €';
  }

  function updateHighlight(row) {
    const count = parseInt(row.querySelector('.count-box').textContent) || 0;
    row.classList.toggle('highlight', count > 0);
  }

  document.querySelectorAll('.product-row').forEach(row => {
    const plus = row.querySelector('.btn-plus');
    const minus = row.querySelector('.btn-minus');
    const countBox = row.querySelector('.count-box');

    plus.addEventListener('click', () => {
      countBox.textContent = parseInt(countBox.textContent) + 1;
      updateHighlight(row);
      updateTotal();
    });

    minus.addEventListener('click', () => {
      const current = parseInt(countBox.textContent);
      if (current > 0) {
        countBox.textContent = current - 1;
        updateHighlight(row);
        updateTotal();
      }
    });

    updateHighlight(row);
  });

  const orderBtn = document.getElementById('send-whatsapp');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      const items = [];
      document.querySelectorAll('.product-row').forEach(row => {
        const name = row.querySelector('.product-name').textContent.trim();
        const count = parseInt(row.querySelector('.count-box').textContent) || 0;
        if (count > 0) {
          items.push({ name, count });
        }
      });

      if (items.length === 0) {
        alert("Niste odabrali nijedan proizvod.");
        return;
      }

      fetch('/webhook/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: tableNumber, items })
      })
      .then(res => res.ok ? alert("Narudžba je poslana!") : alert("Greška pri slanju."))
      .catch(err => {
        console.error("Greška:", err);
        alert("Greška u mrežnoj komunikaciji.");
      });
    });
  }

  updateTotal();
});
