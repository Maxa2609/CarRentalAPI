const carsUri = 'api/Cars';
let allCars = [];
let allBrands = [];
let allClasses = [];

document.addEventListener("DOMContentLoaded", async () => {
    const resB = await fetch('api/CarBrands');
    allBrands = await resB.json();

    const resC = await fetch('api/CarClasses');
    allClasses = await resC.json();

    const resCars = await fetch(carsUri);
    allCars = await resCars.json();

    displayCars(allCars);
});

function displayCars(carsToDisplay) {
    const catalog = document.getElementById('carCatalog');
    catalog.innerHTML = '';

    if (carsToDisplay.length === 0) {
        catalog.innerHTML = '<p>На жаль, автомобілів за вашим запитом не знайдено.</p>';
        return;
    }

    carsToDisplay.forEach(car => {
        const b = allBrands.find(x => x.id === car.brandId);
        const cl = allClasses.find(x => x.id === car.classId);

        const brandName = b ? b.name : "Невідома марка";
        const className = cl ? cl.className : "Невідомий клас";
        const dailyRate = cl ? cl.baseDailyRate : 0;

        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
            <h2>${brandName} ${car.model}</h2>
            <p><strong>Рік випуску:</strong> ${car.year}</p>
            <p><strong>Клас:</strong> ${className}</p>
            <p><strong>Ціна за день:</strong> ${dailyRate} грн</p>
            <p><strong>Номер:</strong> ${car.licensePlate}</p>
            <button class="book-btn" onclick="openBookingModal(${car.id}, '${brandName}', '${car.model}', ${dailyRate})">Орендувати</button>
        `;
        catalog.appendChild(card);
    });
}

function searchCars() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredCars = allCars.filter(car => {
        const b = allBrands.find(x => x.id === car.brandId);
        const brandName = b ? b.name.toLowerCase() : "";
        const modelName = car.model ? car.model.toLowerCase() : "";
        return brandName.includes(query) || modelName.includes(query);
    });
    displayCars(filteredCars);
}

function openBookingModal(carId, brandName, model, price) {
    document.getElementById('book-carId').value = carId;
    document.getElementById('book-price').value = price;
    document.getElementById('bookingCarInfo').innerText = `Авто: ${brandName} ${model} | Ціна: ${price} грн/день`;

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('bookingModal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('bookingModal').style.display = 'none';
}

function calculateTotal() {
    const start = new Date(document.getElementById('rent-start').value);
    const end = new Date(document.getElementById('rent-end').value);
    const price = parseFloat(document.getElementById('book-price').value);

    if (start && end && end >= start) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const total = days * price;
        document.getElementById('total-price-display').innerText = `Сума до оплати: ${total} грн`;
        return total;
    }
    document.getElementById('total-price-display').innerText = `Сума до оплати: 0 грн`;
    return 0;
}

function openPaymentModal() {
    const total = calculateTotal();
    if (total <= 0) {
        alert("Вкажіть коректні дати оренди.");
        return;
    }

    document.getElementById('paymentAmountText').innerText = `${total} грн`;
    document.getElementById('mock-payment-check').checked = false;

    document.getElementById('bookingModal').style.display = 'none';
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

async function confirmPaymentAndBook() {
    if (!document.getElementById('mock-payment-check').checked) {
        alert("Помилка: Оплата не пройшла. Будь ласка, підтвердіть успішну транзакцію.");
        return;
    }

    const total = calculateTotal();

    const cust = {
        fullName: document.getElementById('cust-name').value,
        driverLicense: document.getElementById('cust-license').value,
        phone: document.getElementById('cust-phone').value
    };

    let custRes = await fetch('api/Customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) });
    let custData = await custRes.json();

    const order = {
        rentStartDate: document.getElementById('rent-start').value + "T00:00:00",
        rentEndDate: document.getElementById('rent-end').value + "T00:00:00",
        totalAmount: total,
        carId: parseInt(document.getElementById('book-carId').value),
        customerId: custData.id
    };

    let orderRes = await fetch('api/RentalOrders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    let orderData = await orderRes.json();

    const payment = {
        paymentDate: new Date().toISOString(),
        amount: total,
        rentalOrderId: orderData.id
    };

    await fetch('api/Payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payment) });

    alert('Успіх! Оренда оформлена та оплачена.');
    closePaymentModal();
}