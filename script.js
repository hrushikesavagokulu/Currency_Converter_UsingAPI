const apiKey = 'd0b1ef187477629b5ca3c9e0';
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');

// Create INR note element dynamically
const inrNote = document.createElement('div');
inrNote.id = 'inr-note';
resultDiv.after(inrNote);

// Load currency list
async function loadCurrencies() {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
    const data = await res.json();

    data.supported_codes.forEach(([code, name]) => {
        const option1 = new Option(`${code} - ${name}`, code);
        const option2 = new Option(`${code} - ${name}`, code);
        fromCurrency.add(option1);
        toCurrency.add(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
    updateFlags();
}

function updateFlags() {
    fromFlag.src = `https://flagcdn.com/48x36/${fromCurrency.value.slice(0, 2).toLowerCase()}.png`;
    toFlag.src = `https://flagcdn.com/48x36/${toCurrency.value.slice(0, 2).toLowerCase()}.png`;
}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
    const data = await res.json();

    if (data.result === "success") {
        const converted = data.conversion_result.toFixed(2);
        resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;

        // Fetch INR value as a light note
        const inrRes = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/INR/${amount}`);
        const inrData = await inrRes.json();
        if (inrData.result === "success") {
            inrNote.textContent = `(Approx. ₹${inrData.conversion_result.toFixed(2)} INR)`;
        } else {
            inrNote.textContent = '';
        }

    } else {
        resultDiv.textContent = "Error fetching conversion.";
        inrNote.textContent = "";
    }
}

convertBtn.addEventListener('click', convertCurrency);
fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

loadCurrencies();
