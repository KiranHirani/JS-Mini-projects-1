//UI Vars 
const amt = document.getElementById('amount'),
    service = document.getElementById('service'),
    people = document.getElementById('peopleInput'),
    form = document.getElementById('tip-form'),
    results = document.getElementById('results'),
    tipCalculated = document.getElementById('tipC'),
    yourBill = document.getElementById('yourBill'),
    tipPercent = document.getElementById('tipP'),
    tipForEach = document.getElementById('tipEP'),
    amtForEach = document.getElementById('amtEach');

results.style.display = "none";
form.addEventListener('submit', calculateTip);

function calculateTip(event) {
    if (amt.value === '' || service.value === '0' || people.value === '') {
        displayAlert();
        setTimeout(clearAlert, 2000);
    }
    else {
        let billAmt = parseFloat(amt.value), peopleN = parseFloat(people.value);

        //Calculations
        let tipAmt = (0.05 * billAmt) + calculateService();
        let tipEachPerson = tipAmt / peopleN;
        let amtEachPerson = (billAmt + tipAmt) / peopleN;

        //Update the DOM with new values
        tipCalculated.value=`${tipAmt.toFixed(2)} $`;
        yourBill.value=`${billAmt} $`;
        tipPercent.value="5%";
        tipForEach.value=`${tipEachPerson.toFixed(2)} $`;
        amtForEach.value=`${amtEachPerson.toFixed(2)}`;
        results.style.display = "block";

        clearFields();
    }
    event.preventDefault();
}


function displayAlert() {
    const alert = document.createElement('div');
    alert.className = "alert alert-danger";
    alert.appendChild(document.createTextNode('Please enter complete details.'));
    document.getElementById('first').appendChild(alert);
}

function clearAlert() {
    document.querySelector('.alert').remove();
}


function calculateService() {
    switch (parseInt(service.value)) {
        case 1: return 1;
        case 2: return 1.5;
        case 3: return 2;
    }
}

function clearFields(){
     amt.value='';
     service.value=0;
     people.value='';
}

