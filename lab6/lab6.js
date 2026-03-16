// Завдання 1
let a = 10;
let b = 5;

console.log("Сума:", a + b);
console.log("Різниця:", a - b);
console.log("Множення:", a * b);
console.log("Ділення:", a / b);


// Завдання 2
let firstName = "Іван";
let lastName = "Іванов";

let fullName = firstName + " " + lastName;

console.log("Привіт, " + fullName + "!");


// Завдання 3
let age = 20;

if (age >= 18) {
    console.log("Доступ дозволено");
} else {
    console.log("Доступ заборонено");
}


// Завдання 4
for (let i = 1; i <= 10; i++) {
    console.log(i);
}


// Завдання 5
function square(number) {
    return number * number;
}

let result = square(5);
console.log("Квадрат числа 5:", result);


// Завдання 6
let fruits = ["яблуко", "банан", "апельсин"];

fruits.push("груша");

console.log("Масив фруктів:", fruits);