document.getElementById('budget-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Obtiene los valores de ingresos y gastos
    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);

    // Validación de entrada
    if (isNaN(income) || isNaN(expenses) || income < 0 || expenses < 0) {
        alert("Por favor, ingresa valores válidos para ingresos y gastos.");
        return;
    }

    // Calcula el saldo
    const balance = income - expenses;

    // Muestra el resultado
    const resultDiv = document.getElementById('result');
    if (balance > 0) {
        resultDiv.innerHTML = `<p>¡Felicidades! Tienes un saldo positivo de <strong>€${balance.toFixed(2)}</strong> este mes.</p>`;
    } else if (balance < 0) {
        resultDiv.innerHTML = `<p>Atención: Tienes un saldo negativo de <strong>€${Math.abs(balance).toFixed(2)}</strong> este mes. Considera reducir tus gastos.</p>`;
    } else {
        resultDiv.innerHTML = `<p>Tu saldo es de <strong>€0.00</strong>. Estás equilibrado.</p>`;
    }
});