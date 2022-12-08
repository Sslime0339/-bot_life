var botArray = [ bot = new Bot(490, 490), bot = new Bot(490, 490) ]
console.log(botArray)

//определяет столкновение
const colision = (bot1, bot2) => {
    /*
    uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;*/


    if (bot1.X + 20 >= bot2.X &&     // r1 right edge past r2 left
    bot1.X <= bot2.X + 20 &&       // r1 left edge past r2 right
    bot1.Y + 20 >= bot2.Y &&       // r1 top edge past r2 bottom
    bot1.Y <= bot2.Y + 20) {       // r1 bottom edge past r2 top
        console.log('вылезай!');

        if (Math.abs(bot2.X - bot1.X) > Math.abs(bot2.Y - bot1.Y)) {
            if (bot2.X < bot1.X) { bot1.X = bot2.X + 20; }
            if (bot2.X > bot1.X) { bot1.X = bot2.X - 20; }
        } else {
            if (bot2.Y < bot1.Y) { bot1.Y = bot2.Y + 20; }
            if (bot2.Y > bot1.Y) { bot1.Y = bot2.Y - 20; }
        }
    }
}

//обновляет игру. Всм передвигает ироков и тд.
const update = () => {
    for (var i = 0; i < botArray.length; i++) {
        var bot = botArray[i];

        if (bot.X == bot.whereX && bot.Y == bot.whereY) { continue; }           //проверяет нужно ли боту двигатся

        var r = Math.sqrt(Math.pow(bot.whereX - bot.X, 2) + Math.pow(bot.whereY - bot.Y, 2));   //радиус до того куда он хочет идти
        if (r < bot.speed) {                                                //если растояние меньше скорости то просто переместить
            bot.X = bot.whereX;
            bot.Y = bot.whereY;
        } else {                                            //вычисляет куда ему переместится чтобы растояние соответствовала скорости
            bot.X += bot.speed * (bot.whereX - bot.X) / r;
            bot.Y += bot.speed * (bot.whereY - bot.Y) / r;
        }

        for (var j = 0; j < botArray.length; j++) {                         //проверяем колизию
            var bot2 = botArray[j];
            if (i != j) {
                colision(bot, bot2);
            }
        }
    }
}

//когда игрок нажимает кнопку
document.addEventListener('keydown', function(e) {
    if (e.code == 'KeyW') { botArray[0].whereY -= 5 }
    if (e.code == 'KeyA') { botArray[0].whereX -= 5 }
    if (e.code == 'KeyS') { botArray[0].whereY += 5 }
    if (e.code == 'KeyD') { botArray[0].whereX += 5 }
})

//когда игрок кликает
document.addEventListener('click', function(e) {
    botArray[1].whereX = e.x - 15;
    botArray[1].whereY = e.y - 15;
})

//вот тут игра
window.onload = () => {
    var canv = document.getElementById("canvas");
    if (canv && canv.getContext) {
        var context = canv.getContext('2d');

        botArray[0].whereX = 240;
        botArray[0].whereY = 50;

        botArray[1].whereX = 0;
        botArray[1].whereY = 0;

        botArray[1].speed = 5;

        setInterval(() => {
            update()

            context.fillStyle = '#888888';
            context.fillRect(0, 0, 500, 500);

            for (var i = 0; i < botArray.length; i++){
                var bot = botArray[i];
                context.fillStyle = '#000000';
                context.fillRect(bot.X, bot.Y, 20, 20);
                context.fillStyle = '#ff0000';
                context.fillRect(bot.whereX + 5, bot.whereY + 5, 10, 10);
            }

        }, 1000 / 40);
    }
}

