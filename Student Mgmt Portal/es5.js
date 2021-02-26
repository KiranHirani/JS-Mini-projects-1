document.addEventListener('DOMContentLoaded', function () {

    const store = new Store();
    let s = store.getFromLS();
    if (s.length > 0) {
        id = s[s.length - 1].id;
        store.display();
    }
    const ui = new UI();
    ui.feesSubmission();
})

let id = 0;

//Student constructor function 
function Student(name, grade, fees) {
    id = id + 1;
    this.name = name;
    this.grade = grade;
    this.fees = fees;
    this.id = id;
}

// Student.prototype.feesDeposited = function () {
//     if (this.fees === "1") {
//         count++;
//     }
//     let studentsYetToDeposit = totalStudents - count;

//     return {
//         studentsDeposited: count,
//         studentYetToDeposit: studentsYetToDeposit
//     }
// }

function UI() { }

UI.prototype.addStudent = function (student) {

    //Create an element 
    const div = document.createElement('div');
    div.className = "card ml-3 mt-2";
    div.style.width = "18rem";
    div.style.display = "inline-block";

    const div2 = document.createElement('div');
    div2.className = "card-header";
    div2.style.fontWeight = "bold";
    div2.style.fontSize = "20px";
    div2.appendChild(document.createTextNode(`${student.id} :: ${student.name}`));

    const div3 = document.createElement('div');
    div3.className = "card-body";
    div3.innerHTML = `
    Grade :: ${student.grade} 
    <br>
    Fees :: ${student.fees === "1" ? 'Fees Deposited' : 'Is yet to deposit fees'}`;

    const trash = document.createElement('a');
    trash.className = "delete";
    trash.style.right = "10px";
    trash.style.position = "absolute";
    trash.innerHTML = '<i class="fa fa-trash"></i>';

    div3.appendChild(trash);
    if (student.fees === "1") {
        div3.style.backgroundColor = "lightblue"
    }

    div.appendChild(div2);
    div.appendChild(div3);

    document.getElementById('studentCard').appendChild(div);
}

UI.prototype.displayAlert = function (msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));
    const studentDetails = document.querySelector('#studentDetails');
    const details = document.querySelector('#details');
    studentDetails.insertBefore(div, details);

    //remove alert
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 2000);
}

UI.prototype.delete = function (target) {

    if (target.parentElement.className === "delete") {
        let name = target.parentElement.parentElement.previousElementSibling.textContent;
        target.parentElement.parentElement.parentElement.remove();
        const ui = new UI();
        const store = new Store();
        store.removeFromLS(name);
        ui.displayAlert('Student deleted!', 'alert-success');
    }
}

UI.prototype.clearFields = function () {
    document.getElementById('name').value = '';
    document.getElementById('class').value = '';
    document.getElementById('fees').value = "0"
}


UI.prototype.feesSubmission = function () {
    const feesDep = document.getElementById('feesDep'),
        feesNotDep = document.getElementById('feesNotDep'),
        store = new Store();

    let students = store.getFromLS();
    let feesD = 0, feesNd = 0;
    students.forEach(function (student) {
        if (student.fees === "1") {
            feesD++;
        } else {
            feesNd++;
        }
    });
    feesDep.innerHTML = `${feesD} students have submitted their fees.`
    feesNotDep.innerHTML = `${feesNd} students are yet to submit their fees.`
}

//Store in LS 
function Store() { }

Store.prototype.addToLS = function (student) {
    const store = new Store(),
        ui = new UI();
    let students = store.getFromLS();

    students.push(student);
    console.log(student);
    localStorage.setItem('students', JSON.stringify(students));
    ui.feesSubmission();
}

Store.prototype.removeFromLS = function (name) {
    const store = new Store(),
        ui = new UI();
    let students = store.getFromLS();
    students.forEach(function (student, index) {
        if (name.includes(student.id)) {
            students.splice(index, 1);
        }
    });
    localStorage.setItem('students', JSON.stringify(students));
    ui.feesSubmission();
}

Store.prototype.getFromLS = function () {
    let students;
    if (localStorage.getItem('students') === null) {
        students = [];
    } else {
        students = JSON.parse(localStorage.getItem('students'));
    }
    return students;
}

Store.prototype.display = function () {
    const store = new Store();
    const ui = new UI();
    const students = store.getFromLS();
    students.forEach(function (student) {
        ui.addStudent(student);
    })
}



//Event Listener to add the student 
document.querySelector('#save').addEventListener('click', function () {
    //Get the fields 
    const name = document.getElementById('name').value,
        grade = document.getElementById('class').value,
        fees = document.getElementById('fees').value;

    const ui = new UI();
    const store = new Store();

    //Check if fields are filled
    if (name === '' || grade === '' || fees === "0") {
        //display alert 
        ui.displayAlert('Please fill all the fields', 'alert-danger');

    } else {
        //Instantiate objects
        const student = new Student(name, grade, fees);
        console.log(student);
        //Add student to UI
        ui.addStudent(student);
        store.addToLS(student);

        ui.displayAlert('Student added !', 'alert-success');
        //Clear the fields
        ui.clearFields();
    }
})


document.querySelector('#studentCard').addEventListener('click', function (event) {
    const ui = new UI();
    ui.delete(event.target);
    event.preventDefault();
})

