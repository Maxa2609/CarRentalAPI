let brandsData = [];
let classesData = [];

function logout() {
    sessionStorage.removeItem('adminToken');
    window.location.replace('Index.html');
}

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    if (tabId === 'brands') loadBrands();
    if (tabId === 'carclasses') loadCarClasses();
    if (tabId === 'cars') loadCars();
    if (tabId === 'customers') loadCustomers();
    if (tabId === 'orders') loadOrders();
}

function openModal(modalId) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById(modalId).style.display = 'none';
}

function loadBrands() {
    fetch('api/CarBrands').then(res => res.json()).then(data => {
        const tbody = document.getElementById('brands-table');
        tbody.innerHTML = '';
        data.forEach(b => {
            tbody.innerHTML += `<tr><td>${b.id}</td><td>${b.name}</td>
            <td><button class="edit-btn" onclick="editBrand(${b.id}, '${b.name}')">✏️</button>
            <button class="delete-btn" onclick="deleteBrand(${b.id})" title="Видалити">🗑️</button></td></tr>`;
        });
    });
}

function openAddBrand() {
    document.getElementById('edit-brand-id').value = '';
    document.getElementById('add-brand-name').value = '';
    document.getElementById('brandModalTitle').innerText = 'Додати марку';
    openModal('brandModal');
}

function editBrand(id, name) {
    document.getElementById('edit-brand-id').value = id;
    document.getElementById('add-brand-name').value = name;
    document.getElementById('brandModalTitle').innerText = 'Редагувати марку';
    openModal('brandModal');
}

function saveBrand() {
    const id = document.getElementById('edit-brand-id').value;
    const name = document.getElementById('add-brand-name').value;

    if (id) {
        fetch(`api/CarBrands/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: parseInt(id), name: name }) })
            .then(() => { closeModal('brandModal'); loadBrands(); });
    } else {
        fetch('api/CarBrands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name }) })
            .then(() => { closeModal('brandModal'); loadBrands(); });
    }
}

function deleteBrand(id) {
    if (confirm("Ви точно хочете видалити цей запис?")) fetch(`api/CarBrands/${id}`, { method: 'DELETE' }).then(() => loadBrands());
}

function loadCarClasses() {
    fetch('api/CarClasses').then(res => res.json()).then(data => {
        const tbody = document.getElementById('classes-table');
        tbody.innerHTML = '';
        data.forEach(c => {
            tbody.innerHTML += `<tr><td>${c.id}</td><td>${c.className}</td><td>${c.baseDailyRate}</td>
            <td><button class="edit-btn" onclick="editCarClass(${c.id}, '${c.className}', ${c.baseDailyRate})">✏️</button> 
            <button class="delete-btn" onclick="deleteCarClass(${c.id})" title="Видалити">🗑️</button></td></tr>`;
        });
    });
}

function openAddCarClass() {
    document.getElementById('edit-class-id').value = '';
    document.getElementById('add-class-name').value = '';
    document.getElementById('add-class-rate').value = '';
    document.getElementById('classModalTitle').innerText = 'Додати клас';
    openModal('classModal');
}

function editCarClass(id, name, rate) {
    document.getElementById('edit-class-id').value = id;
    document.getElementById('add-class-name').value = name;
    document.getElementById('add-class-rate').value = rate;
    document.getElementById('classModalTitle').innerText = 'Редагувати клас';
    openModal('classModal');
}

function saveCarClass() {
    const id = document.getElementById('edit-class-id').value;
    const c = { className: document.getElementById('add-class-name').value, baseDailyRate: parseFloat(document.getElementById('add-class-rate').value) };

    if (id) {
        c.id = parseInt(id);
        fetch(`api/CarClasses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
            .then(() => { closeModal('classModal'); loadCarClasses(); });
    } else {
        fetch('api/CarClasses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
            .then(() => { closeModal('classModal'); loadCarClasses(); });
    }
}

function deleteCarClass(id) {
    if (confirm("Ви точно хочете видалити цей запис?")) fetch(`api/CarClasses/${id}`, { method: 'DELETE' }).then(() => loadCarClasses());
}

async function loadOptions() {
    const resB = await fetch('api/CarBrands');
    brandsData = await resB.json();
    const selectB = document.getElementById('add-car-brandId');
    selectB.innerHTML = '<option value="">Оберіть марку...</option>';
    brandsData.forEach(b => selectB.innerHTML += `<option value="${b.id}">${b.name}</option>`);

    const resC = await fetch('api/CarClasses');
    classesData = await resC.json();
    const selectC = document.getElementById('add-car-classId');
    selectC.innerHTML = '<option value="">Оберіть клас...</option>';
    classesData.forEach(c => selectC.innerHTML += `<option value="${c.id}">${c.className}</option>`);
}

async function loadCars() {
    await loadOptions();
    const res = await fetch('api/Cars');
    const data = await res.json();
    const tbody = document.getElementById('cars-table');
    tbody.innerHTML = '';
    data.forEach(c => {
        const b = brandsData.find(x => x.id === c.brandId);
        const cl = classesData.find(x => x.id === c.classId);
        const brandName = b ? b.name : "Невідома";
        const className = cl ? cl.className : "Невідомий";
        tbody.innerHTML += `<tr><td>${brandName}</td><td>${c.model}</td><td>${className}</td><td>${c.year}</td><td>${c.licensePlate}</td>
        <td><button class="edit-btn" onclick="editCar(${c.id}, '${c.model}', ${c.year}, '${c.licensePlate}', ${c.brandId}, ${c.classId})">✏️</button>
        <button class="delete-btn" onclick="deleteCar(${c.id})" title="Видалити">🗑️</button></td></tr>`;
    });
}

function openAddCar() {
    document.getElementById('edit-car-id').value = '';
    document.getElementById('add-car-model').value = '';
    document.getElementById('add-car-year').value = '';
    document.getElementById('add-car-plate').value = '';
    document.getElementById('add-car-brandId').value = '';
    document.getElementById('add-car-classId').value = '';
    document.getElementById('carModalTitle').innerText = 'Додати авто';
    openModal('carModal');
}

function editCar(id, model, year, plate, brandId, classId) {
    document.getElementById('edit-car-id').value = id;
    document.getElementById('add-car-model').value = model;
    document.getElementById('add-car-year').value = year;
    document.getElementById('add-car-plate').value = plate;
    document.getElementById('add-car-brandId').value = brandId;
    document.getElementById('add-car-classId').value = classId;
    document.getElementById('carModalTitle').innerText = 'Редагувати авто';
    openModal('carModal');
}

function saveCar() {
    const id = document.getElementById('edit-car-id').value;
    const car = {
        model: document.getElementById('add-car-model').value,
        year: parseInt(document.getElementById('add-car-year').value),
        licensePlate: document.getElementById('add-car-plate').value,
        brandId: parseInt(document.getElementById('add-car-brandId').value),
        classId: parseInt(document.getElementById('add-car-classId').value)
    };

    if (id) {
        car.id = parseInt(id);
        fetch(`api/Cars/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car) })
            .then(() => { closeModal('carModal'); loadCars(); });
    } else {
        fetch('api/Cars', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car) })
            .then(() => { closeModal('carModal'); loadCars(); });
    }
}

function deleteCar(id) {
    if (confirm("Ви точно хочете видалити цей запис?")) fetch(`api/Cars/${id}`, { method: 'DELETE' }).then(() => loadCars());
}

function loadCustomers() {
    fetch('api/Customers').then(res => res.json()).then(data => {
        const tbody = document.getElementById('customers-table');
        tbody.innerHTML = '';
        data.forEach(c => {
            tbody.innerHTML += `<tr><td>${c.id}</td><td>${c.fullName}</td><td>${c.driverLicense}</td><td>${c.phone}</td>
            <td><button class="edit-btn" onclick="editCustomer(${c.id}, '${c.fullName}', '${c.driverLicense}', '${c.phone}')">✏️</button>
            <button class="delete-btn" onclick="deleteCustomer(${c.id})" title="Видалити">🗑️</button></td></tr>`;
        });
    });
}

function openAddCustomer() {
    document.getElementById('edit-cust-id').value = '';
    document.getElementById('edit-cust-name').value = '';
    document.getElementById('edit-cust-license').value = '';
    document.getElementById('edit-cust-phone').value = '';
    document.getElementById('custModalTitle').innerText = 'Додати клієнта';
    openModal('custModal');
}

function editCustomer(id, name, license, phone) {
    document.getElementById('edit-cust-id').value = id;
    document.getElementById('edit-cust-name').value = name;
    document.getElementById('edit-cust-license').value = license;
    document.getElementById('edit-cust-phone').value = phone;
    document.getElementById('custModalTitle').innerText = 'Редагувати клієнта';
    openModal('custModal');
}

function saveCustomer() {
    const id = document.getElementById('edit-cust-id').value;
    const cust = { fullName: document.getElementById('edit-cust-name').value, driverLicense: document.getElementById('edit-cust-license').value, phone: document.getElementById('edit-cust-phone').value };

    if (id) {
        cust.id = parseInt(id);
        fetch(`api/Customers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) })
            .then(() => { closeModal('custModal'); loadCustomers(); });
    } else {
        fetch('api/Customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cust) })
            .then(() => { closeModal('custModal'); loadCustomers(); });
    }
}

function deleteCustomer(id) {
    if (confirm("Ви точно хочете видалити цей запис?")) fetch(`api/Customers/${id}`, { method: 'DELETE' }).then(() => loadCustomers());
}

async function loadOrders() {
    const resO = await fetch('api/RentalOrders');
    const orders = await resO.json();

    const resP = await fetch('api/Payments');
    const payments = await resP.json();

    const tbody = document.getElementById('orders-table');
    tbody.innerHTML = '';
    orders.forEach(o => {
        const isPaid = payments.some(p => p.rentalOrderId === o.id);
        const statusHtml = isPaid ? '<span style="color: #2ecc71; font-weight: bold;">Оплачено ✅</span>' : '<span style="color: #e74c3c; font-weight: bold;">Очікує ❌</span>';

        tbody.innerHTML += `<tr><td>${o.id}</td><td>${new Date(o.rentStartDate).toLocaleDateString()}</td><td>${new Date(o.rentEndDate).toLocaleDateString()}</td><td>${o.totalAmount} грн</td><td>${statusHtml}</td>
        <td><button class="edit-btn" onclick="editOrder(${o.id}, '${o.rentStartDate}', '${o.rentEndDate}', ${o.totalAmount}, ${o.carId}, ${o.customerId})">✏️</button>
        <button class="delete-btn" onclick="deleteOrder(${o.id})" title="Видалити">🗑️</button></td></tr>`;
    });
}

function editOrder(id, start, end, amount, carId, custId) {
    document.getElementById('edit-order-id').value = id;
    document.getElementById('edit-order-start').value = start.split('T')[0];
    document.getElementById('edit-order-end').value = end.split('T')[0];
    document.getElementById('edit-order-amount').value = amount;
    document.getElementById('edit-order-carId').value = carId;
    document.getElementById('edit-order-custId').value = custId;
    openModal('orderModal');
}

function saveOrder() {
    const id = document.getElementById('edit-order-id').value;
    const order = {
        id: parseInt(id),
        rentStartDate: document.getElementById('edit-order-start').value + "T00:00:00",
        rentEndDate: document.getElementById('edit-order-end').value + "T00:00:00",
        totalAmount: parseFloat(document.getElementById('edit-order-amount').value),
        carId: parseInt(document.getElementById('edit-order-carId').value),
        customerId: parseInt(document.getElementById('edit-order-custId').value)
    };
    fetch(`api/RentalOrders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
        .then(() => { closeModal('orderModal'); loadOrders(); });
}

function deleteOrder(id) {
    if (confirm("Ви точно хочете видалити цей запис?")) fetch(`api/RentalOrders/${id}`, { method: 'DELETE' }).then(() => loadOrders());
}

window.onload = loadBrands;