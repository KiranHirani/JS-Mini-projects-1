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

class Student {
    constructor(name, grade, fees) {
        id++;
        this.name = name;
        this.grade = grade;
        this.fees = fees;
        this.id = id;
    }
}

class UI {

    addStudent(student) {
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

    displayAlert(msg, className) {
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

    delete(target) {
        if (target.parentElement.className === "delete") {
            let name = target.parentElement.parentElement.previousElementSibling.textContent;
            target.parentElement.parentElement.parentElement.remove();
            const ui = new UI();
            const store = new Store();
            store.removeFromLS(name);
            ui.displayAlert('Student deleted!', 'alert-success');
        }
    }

    clearFields() {
        document.getElementById('name').value = '';
        document.getElementById('class').value = '';
        document.getElementById('fees').value = "0"
    }

    feesSubmission() {
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
}

class Store {

    addToLS(student) {
        const store = new Store(),
            ui = new UI();
        let students = store.getFromLS();

        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        ui.feesSubmission();
    }

    removeFromLS(name) {
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


    getFromLS() {
        let students;
        if (localStorage.getItem('students') === null) {
            students = [];
        } else {
            students = JSON.parse(localStorage.getItem('students'));
        }
        return students;
    }

    display() {
        const store = new Store();
        const ui = new UI();
        const students = store.getFromLS();
        students.forEach(function (student) {
            ui.addStudent(student);
        })
    }
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
