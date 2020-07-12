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

/*-----------Drag'n'Drop---------------- - */

let money = document.querySelectorAll(".money img"); // ищем все купюры

/*for (let i = 0; i < money.length; i++) {    //прогоняем купюры через цикл    вариант 1 
  money[i].onclick = takeMoney;
} */

/*<div class="coffee-item" onclick="cookCoffee('Капучино', 92, this)"></div>
coffeeItem.onclick = function () {
  cookCoffee('Капучино', 92, this);
}*/
// В функцию, которая присвоена событию, передается this, который возвращает элемент, на котором это событие совершено

for (let bill of money) {   // вариант 2 bill - купюра 
  bill.onmousedown = takeMoney;
}
// В функцию, которая присвоена событию, первым параметром передается объект события - event
function takeMoney(event) {
  event.preventDefault(); // убирает призрака купюры
/*  console.log(this);
  console.log(event);
  console.log([event.target, event.clientX, event.clirntY]);*/
  let bill = this;
  
/*  console.log(bill.style.height);// ""
  console.log(bill.style.width);// ""
  console.log( bill.getBoundingClientRect() );// возвращает объект domRect в пикселях*/

  let billCoords = bill.getBoundingClientRect();  // getBoundingClientRect - получение объектаа, который описывает положение элемента на странице
  
  let billHeight = billCoords.height;
  let billWidth = billCoords.width;
  
  bill.style.position = "absolute";
  if (!bill.style.transform) { //bill.style.transform == "" ("" == false)
    bill.style.top = (event.clientY - billHeight/2) + "px";
    bill.style.left = (event.clientX - billWidth/2) + "px";
    bill.style.transform = "rotate(90deg)";
  } else {
    bill.style.top = (event.clientY - billWidth/2) + "px";
    bill.style.left = (event.clientX - billHeight/2) + "px";
  }
 bill.style.transition = "transform .3s)";
  
  window.onmousemove = function(event) {
                                                        //console.log([event.clientX, event.clirntY]);
                                                        //console.log(this);
    let billCoords = bill.getBoundingClientRect();
    let billHeight = billCoords.height;
    let billWidth = billCoords.width;
    bill.style.top = (event.clientY - billWidth/2) + "px";
    bill.style.left = (event.clientX - billHeight/2) + "px";  
  };
  
  bill.onmouseup = function() {
    window.onmousemove = null;
    if ( inAtm(bill) ) {
      console.log( bill.getAttribute("data-cost") );
      console.log( bill.dataset.cost );
      balance.value = +balance.value + +bill.dataset.cost; // для сложения баланса на экране делаем: приведение к числу balance.value , слодение  и приведение кчислу bill.dataset.cost
      bill.remove(); // удаляем элемент , т.о. при попадании в банкомат купюра исчезает
    }
  };
}

function inAtm(bill) {
  let atm = document.querySelector(".atm img");
  
  let atmCoords = atm.getBoundingClientRect();
  let atmLeftX = atmCoords.x;
  let atmRightX = atmCoords.x + atmCoords.width;
  let atmTopY = atmCoords.y;
  let atmBottomY = atmCoords.y + atmCoords.height/3;
  
  let billCoords = bill.getBoundingClientRect();
  let billLeftX = billCoords.x;
  let billRightX = billCoords.x + billCoords.width;
  let billY = billCoords.y;
  if (
        billLeftX > atmLeftX
    &&  billRightX < atmRightX
    &&  billY > atmTopY
    &&  billY < atmBottomY
    ) {
    return true;
    } else {
      return false;
    }
  }

/*  return {
    atm: [atmLeftX, atmRightX, atmTopY, atmBottomY],
    bill: [billLeftX, billRightX, billY],
  };*/


















