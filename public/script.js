
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
  .then(data => {
    alert("Narudžba je poslana!");
    productRows.forEach(row => {
      row.querySelector('.count-box').textContent = '0';
    });
  })
  .catch(err => {
    alert("Došlo je do greške. Pokušajte ponovno.");
    console.error(err);
  });
});

    const countBox = row.querySelector('.count-box');
    const count = parseInt(countBox.textContent) || 0;
    if (count > 0) {
      row.classList.add('highlight');
    } else {
      row.classList.remove('highlight');
    }
  }

  document.querySelectorAll('.product-row').forEach(row => {
    const minusBtn = row.querySelector('.btn-minus');
    const plusBtn = row.querySelector('.btn-plus');
    const countBox = row.querySelector('.count-box');

    plusBtn.addEventListener('click', () => {
      let value = parseInt(countBox.textContent);
      countBox.textContent = value + 1;
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

  const main = document.querySelector('main');
  if (!main) return;

  const headers = main.querySelectorAll('h3');
  headers.forEach((header, index) => {
    let elem = header.nextElementSibling;
    while (elem && elem.tagName !== 'H3') {
      if (index !== 0 && !elem.classList.contains('menu-divider')) {
        elem.style.display = 'none';
      }
      elem = elem.nextElementSibling;
    }
  });

  headers.forEach(header => {
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
      .then(response => {
        if (response.ok) {
          alert("Narudžba je poslana!");
        } else {
          alert("Greška pri slanju narudžbe.");
        }
      })
      .catch(error => {
        console.error("Greška:", error);
        alert("Greška u mrežnoj komunikaciji.");
      });
    });
  }

  updateTotal();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
