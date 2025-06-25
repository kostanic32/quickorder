
document.addEventListener('DOMContentLoaded', () => {
  function updateHighlight(row) {
    const countBox = row.querySelector('.count-box');
    const count = parseInt(countBox.textContent) || 0;
    row.classList.toggle('highlight', count > 0);
  }

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.product-row').forEach(row => {
      const count = parseInt(row.querySelector('.count-box').textContent) || 0;
      const price = parseFloat(row.querySelector('.price-box').dataset.price) || 0;
      total += count * price;
    });
    document.getElementById('total-price').textContent = `${total.toFixed(2)} €`;
  }

  document.querySelectorAll('.product-row').forEach(row => {
    const minusBtn = row.querySelector('.btn-minus');
    const plusBtn = row.querySelector('.btn-plus');
    const countBox = row.querySelector('.count-box');

    plusBtn.addEventListener('click', () => {
      countBox.textContent = parseInt(countBox.textContent) + 1;
      updateHighlight(row);
      updateTotal();
    });

    minusBtn.addEventListener('click', () => {
      let value = parseInt(countBox.textContent);
      if (value > 0) {
        countBox.textContent = value - 1;
        updateHighlight(row);
        updateTotal();
      }
    });

    updateHighlight(row);
  });

  // Pošalji narudžbu
  document.getElementById('send-whatsapp').addEventListener('click', () => {
    const productRows = document.querySelectorAll('.product-row');
    const items = [];

    productRows.forEach(row => {
      const name = row.querySelector('.product-name').textContent.trim();
      const count = parseInt(row.querySelector('.count-box').textContent.trim());
      if (count > 0) {
        items.push({ name, count });
      }
    });

    if (items.length === 0) {
      alert("Niste odabrali nijedan proizvod.");
      return;
    }

    const table = prompt("Unesite broj stola:");
    if (!table) {
      alert("Broj stola je obavezan.");
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });

    const order = { table, items, time };

    fetch('/webhook/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(() => {
      alert("Narudžba je poslana!");
      productRows.forEach(row => row.querySelector('.count-box').textContent = '0');
      updateTotal();
    })
    .catch(err => {
      alert("Došlo je do greške. Pokušajte ponovno.");
      console.error(err);
    });
  });

  // Glava za sekcije menija
  const headers = document.querySelectorAll('main h3');
  headers.forEach(header => {
    let elem = header.nextElementSibling;
    while (elem && elem.tagName !== 'H3') {
      if (!elem.classList.contains('menu-divider')) {
        elem.style.display = 'none';
      }
      elem = elem.nextElementSibling;
    }

    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      let sibling = header.nextElementSibling;
      while (sibling && sibling.tagName !== 'H3') {
        if (!sibling.classList.contains('menu-divider')) {
          sibling.style.display = sibling.style.display === 'none' ? '' : 'none';
        }
        sibling = sibling.nextElementSibling;
      }
    });
  });

  // Glatko scrollanje
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
