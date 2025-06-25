
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tableNumber = params.get('table') || '';

  function updateHighlight(row) {
    const countBox = row.querySelector('.count-box');
    const count = parseInt(countBox.textContent) || 0;
    if (count > 0) {
      row.classList.add('highlight');
    } else {
      row.classList.remove('highlight');
    }
  }

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.product-row').forEach(row => {
      const price = parseFloat(row.querySelector('.price-box').dataset.price);
      const count = parseInt(row.querySelector('.count-box').textContent) || 0;
      total += price * count;
    });
    document.getElementById('total-price').textContent = `${total.toFixed(2)} €`;
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

      if (!tableNumber) {
        alert("Broj stola nije prepoznat. Molimo da URL sadrži ?table=123");
        return;
      }

      const now = new Date();
      const time = now.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });

      const order = { table: tableNumber, items, time };

      fetch('/webhook/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      .then(res => res.json())
      .then(data => {
        alert("Narudžba je poslana!");
        document.querySelectorAll('.product-row').forEach(row => {
          row.querySelector('.count-box').textContent = '0';
          updateHighlight(row);
        });
        updateTotal();
      })
      .catch(err => {
        alert("Došlo je do greške. Pokušajte ponovno.");
        console.error(err);
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  updateTotal();
});

