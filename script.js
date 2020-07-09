"use strict";

let state = "waiting"; // "cooking" "reading"
let balance = document.querySelector(".balance"); 
let cup = document.querySelector(".cup img");
                                          // onclick="cookCoffee('Американо', 50, this)"
function cookCoffee(name, price, elem) {//console.log(balance.value); // т.о. мы забираем значение баланса из input'а
 if (state != "waiting") {
   return;
 }
  if (balance.value >= price) {
    state = "cooking";
    balance.style.backgroundColor = "";
    balance.value -= price; // balance.value = balance.value - price
    changeDisplayText(`Ваш ${name} готовится`);
    
                                              /* console.log(elem);*/
    let coffeeImg = elem.querySelector("img");
                                              /*console.log(coffeeImg);*/
    let coffeeSrc = coffeeImg.getAttribute("src");
                                              /*console.log(coffeeSrc);
                                               console.log(coffeeImg.src);*/
    
    startCooking(name, coffeeSrc);// вызов функции
  } else {
    changeDisplayText("Недостаточно средств");
    balance.style.backgroundColor = "rgb(255, 50, 50)";
  }
}
                                                // Планирование
                                                // setTimeout(func, ms); -  отрабатывает только один раз
                                                // setInterval(func, ms); - отрабатывает пока не отключили
                                                // let timeout = setTimeout(func, ms);
                                                // let interval = setTimeout(func, ms);
                                                // clearTimeout(timeout)
                                                //clearInterval(interval)
function startCooking(name, src) { //объявление функции
                                                  //let progressBar = document.querySelector(".progress-bar"); этот функционал мы вынесли в отдельную функцию changeProgressPersent
 
  cup.setAttribute("src", src);
  cup.style.display = "inline"; // делаем кружку видимой и применяем inline тк кружки строчные 
  let t = 0;
  let cookingInterval = setInterval(() => { // тоже самое, что и function() {}
    t++;
    cup.style.opacity = t + "%";
    // progressBar.style.width = t + "%";
    changeProgressPersent(t);
    console.log(t);
    if (t == 100) {
      state = "ready";
      clearInterval(cookingInterval);
      changeDisplayText(`Ваш ${name} готов!`);
      cup.style.cursor = "pointer";
      cup.onclick = function() {
        takeCoffee();
      }
    }
  }, 50);
}

function takeCoffee () {
  if (state != "ready") {
    return;
  }
  state = "waiting";
  changeProgressPersent(0);
  cup.style.opacity = 0;
  cup.style.display = ""; // или "none"
  cup.style.cursor = "";
  changeDisplayText("Выберите кофе");
  cup.onclick = null;
}

function changeProgressPersent(persent) {
  let progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = persent + "%";
}

function changeDisplayText(text) {
  if (text.length > 23) {
    text = text.slice(0, 23) + "...";
  }
  let displayText = document.querySelector(".display span"); // локальная переменная для нашей функции
  displayText.innerHTML = text;
}