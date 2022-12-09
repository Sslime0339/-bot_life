var botArray = [ new Bot(), new Bot(), new Bot(), new Bot(), new Bot() ]
var player = new PLayer;


const newbotArray = (id) => {           //удаляет бота
    const newarray = [];
    for (var i = 0; i < botArray.length; i++) {
        if (i != id) {
            let newBot = new Bot();
            newBot.X = botArray[i].X;
            newBot.Y = botArray[i].Y;

            newBot.whereX = botArray[i].whereX;
            newBot.whereY = botArray[i].whereY;
            
            newBot.speed = botArray[i].speed;

            newarray.push(newBot);
        }
    }
    console.log(botArray);
    botArray = newarray;
    console.log(botArray);
}


//определяет столкновение
const colision = (bot1, bot2) => {
    if (bot1.X + 20 >= bot2.X &&     // r1 right edge past r2 left
    bot1.X <= bot2.X + 20 &&       // r1 left edge past r2 right
    bot1.Y + 20 >= bot2.Y &&       // r1 top edge past r2 bottom
    bot1.Y <= bot2.Y + 20) {       // r1 bottom edge past r2 top
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

/*когда игрок нажимает кнопку*
document.addEventListener('keydown', function(e) {
    if (e.code == 'KeyW') { botArray[0].whereY -= 5 }
    if (e.code == 'KeyA') { botArray[0].whereX -= 5 }
    if (e.code == 'KeyS') { botArray[0].whereY += 5 }
    if (e.code == 'KeyD') { botArray[0].whereX += 5 }
})*/

//когда игрок кликает
document.addEventListener('click', function(e) {
    let mx = e.x;
    let my = e.y;

    if (mx > 50 && mx < 100 && my > 350 && my < 400) {   //w
        player.Y += 50;
        return;
    }
    if (mx > 0 && mx < 50 && my > 400 && my < 450) {   //a
        player.X += 50;
        return;
    }
    if (mx > 50 && mx < 100 && my > 450 && my < 500) {   //s
        player.Y -= 50;
        return;
    }
    if (mx > 100 && mx < 150 && my > 400 && my < 450) {   //d
        player.X -= 50;
        return;
    }

    /*
    0 , 450, 25, 25 = A
    25, 475, 25, 25 = S
    25, 425, 25, 25 = W
    50, 450, 25, 25 = D
    */

    mx -= player.X;
    my -= player.Y;


    if (player.idBot != null) {            
        if (mx > botArray[player.idBot].X &&
        mx < botArray[player.idBot].X + 20 &&
        my > botArray[player.idBot].Y &&
        my < botArray[player.idBot].Y + 20) {
            player.idBot = null;
        }
        else {
            botArray[player.idBot].whereX = mx - 5;
            botArray[player.idBot].whereY = my - 5;
        }
    }
    else {
        for (var i = 0; i < botArray.length; i++) {
            if (mx > botArray[i].X &&
            mx < botArray[i].X + 20 &&
            my > botArray[i].Y &&
            my < botArray[i].Y + 20) {
                player.idBot = i;
                break;
            }
        }
    }
})

//вот тут игра
window.onload = () => {
    var canv = document.getElementById("canvas");
    if (canv && canv.getContext) {
        var context = canv.getContext('2d');

        botArray[1].whereX = 240;
        botArray[1].whereY = 50;

        botArray[2].speed = 5;

        
        //botArray.pop(); удалить бота (не работает)
        //botArray.push(new Bot()); //добавить? да
        //delete botArray[0] (не работает)


        //newbotArray(0);  чтобы удалить определёного бота
        

        setInterval(() => {
            update();
            
            context.fillStyle = '#808080';
            context.fillRect(0, 0, 500, 500);


            for (var i = 0; i < botArray.length; i++){
                var bot = botArray[i];
                context.fillStyle = '#000000';
                context.fillRect(bot.X + player.X, bot.Y + player.Y, 20, 20);
            }

            if (player.idBot != null) {
                if (botArray[player.idBot].whereX != botArray[player.idBot].X && 
                botArray[player.idBot].whereY != botArray[player.idBot].Y) {
                    context.fillStyle = '#ff0000';
                    context.fillRect(botArray[player.idBot].whereX + 5 + player.X, botArray[player.idBot].whereY + 5 + player.Y, 10, 10);
                }

                context.strokeStyle = '#ffffff';
                context.LineWidth = 3;
                context.strokeRect(botArray[player.idBot].X + player.X, botArray[player.idBot].Y + player.Y, 20, 20)
            }


            context.fillStyle = '#000000';
            context.fillRect(0, 400, 50, 50);
            context.fillRect(50, 350, 50, 50);
            context.fillRect(50, 450, 50, 50);
            context.fillRect(100, 400, 50, 50);

            context.fillStyle = '#dddddd';
            context.textAlign = 'center';
            context.font = '50px Georgia';

            context.fillText('A', 25, 442);
            context.fillText('S', 75, 492);
            context.fillText('D', 125, 442);
            context.font = '45px Georgia';
            context.fillText('W', 75, 392);

        }, 1000 / 40);
    }
}

