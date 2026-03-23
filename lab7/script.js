//Завдання 2
var a = 2;
var x = 1 + (a *= 2);
console.log("x =", x); // 5

if ("0") {
    alert('Привіт'); // буде, бо "0" truthy
}

let name = "Василь";
let admin = name;
console.log("admin =", admin);

// Завдання 3
let counties = [];


async function fetchData() {
    const response = await fetch("https://api.census.gov/data/2020/acs/acs5/profile?get=NAME&for=county:*");
    const data = await response.json();

    counties = data.slice(1).map(item => ({
        name: item[0],
        state: item[1],
        county: item[2]
    }));
}

function findCountyCode(name) {
    const county = counties.find(c => c.name === name);
    if (county) {
        return county.state + county.county;
    }
    return "Не знайдено";
}

document.getElementById("btn").addEventListener("click", () => {
    const input = document.getElementById("countyInput").value;
    const result = findCountyCode(input);
    document.getElementById("result").innerText = result;
});

fetchData();

//Завдання 4
document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const email = document.getElementById("email").value;

    if (!first || !last || !email) {
        alert("Заповніть всі поля!");
        return;
    }

    alert(`Ім'я: ${first}, Прізвище: ${last}, Email: ${email}`);
});

//Завдання 5
let pos = 0;

document.getElementById("left").onclick = () => {
    pos -= 100;
    document.getElementById("elid").style.left = pos + "px";
};

document.getElementById("right").onclick = () => {
    pos += 100;
    document.getElementById("elid").style.left = pos + "px";
};