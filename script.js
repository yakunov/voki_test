const app = new PIXI.Application({width: 400, height: 300, antialias: true, backgroundColor: 0x000000, resizeTo: window });
const container = new PIXI.Container();
app.stage.addChild(container);

document.body.appendChild(app.view);

const loader = new PIXI.Loader();

loader.add(['img/images.json'])
    .add('img/bg.jpg')
    .load(run);

let startWidth, startHeight, startRatio;

function run() {

    const bg = new PIXI.Sprite(loader.resources['img/bg.jpg'].texture);
    startWidth = bg.width;
    startHeight = bg.height;
    startRatio = startWidth / startHeight;
    container.addChild(bg);

    addDecor(container);

    const stairs = new Stairs();
    const final = new Final();
    const menu = new Menu(stairs.set1, stairs.set2, stairs.set3, final.show);
    const btnHammer = new BtnHammer(menu.show);
    const btnContinue = new BtnContinue();

    container.addChild(stairs.getSprite());
    stairs.getSprite().position.set(startWidth - 560, 0);

    const plantTop = new PIXI.Sprite(loader.resources['img/images.json'].textures['plantTop.png']);
    plantTop.position.set(1120, 420);
    container.addChild(plantTop);

    container.addChild(btnHammer.getSprite());
    btnHammer.getSprite().position.set(1120, 390);
    setTimeout(btnHammer.show, 2000);

    container.addChild(menu.getSprite());
    menu.getSprite().position.set(900, 80);

    container.addChild(final.getSprite());

    container.addChild(btnContinue.getSprite());
    btnContinue.getSprite().position.set(695, 550);

    const logo = new PIXI.Sprite(loader.resources['img/images.json'].textures['logo.png']);
    logo.position.set(10, 6);
    app.stage.addChild(logo);

    resizeListener();
}

function addDecor(container)
{
    const globe = new PIXI.Sprite(loader.resources['img/images.json'].textures['globe.png']);
    globe.position.set(70, 115);
    container.addChild(globe);
    const table = new PIXI.Sprite(loader.resources['img/images.json'].textures['table.png']);
    table.position.set(190, 195);
    container.addChild(table);
    const sofa = new PIXI.Sprite(loader.resources['img/images.json'].textures['sofa.png']);
    sofa.position.set(110, 320);
    container.addChild(sofa);
    const plant1 = new PIXI.Sprite(loader.resources['img/images.json'].textures['plant.png']);
    plant1.position.set(440, -30);
    container.addChild(plant1);
    const plant2 = new PIXI.Sprite(loader.resources['img/images.json'].textures['plant2.png']);
    plant2.position.set(1120, 160);
    container.addChild(plant2);
    const book = new PIXI.Sprite(loader.resources['img/images.json'].textures['bookStand.png']);
    book.position.set(830, -30);
    container.addChild(book);
    const man = new PIXI.Sprite(loader.resources['img/images.json'].textures['man.png']);
    man.position.set(705, 110);
    container.addChild(man);
}

function Final()
{
    const me = this;
    const container = new PIXI.Container();
    container.alpha = 0;

    const bg = new PIXI.Graphics();
    container.addChild(bg);
    bg.beginFill(0x000000, 0.7);
    bg.drawRect(0, 0, startWidth, startHeight);

    const image = new PIXI.Sprite(loader.resources['img/images.json'].textures['final.png']);
    image.anchor.set(0.5, 0);
    container.addChild(image);
    image.position.set(startWidth / 2, 60);

    me.getSprite = function()
    {
        return container;
    };

    me.show = function()
    {
        bg.interactive = true;
        app.ticker.add(step);
    };

    let t = 0;
    let dt = 0.05;
    function step()
    {
        t += dt;
        container.alpha = easeOutCubic(t);

        if (t >= 1) app.ticker.remove(step);
    }
}

function BtnContinue()
{
    const me = this;
    const sprite = new PIXI.Sprite(loader.resources['img/images.json'].textures['btnContinue.png']);
    sprite.anchor.set(0.5, 0.5);

    me.getSprite = function()
    {
        return sprite;
    };

    let t = 0;
    let dt = 0.05;
    function step()
    {
        t += dt;
        const scale = 1 + Math.sin(t) / 16;
        sprite.scale.set(scale, scale);
    }

    app.ticker.add(step);
}

function Menu(callback1, callback2, callback3, callbackOk)
{
    const me = this;
    const container = new PIXI.Container();

    const btn1 = new BtnMenu(loader.resources['img/images.json'].textures['menuStair1.png']);
    container.addChild(btn1.getSprite());
    btn1.getSprite().position.set(0, 0);

    const btn2 = new BtnMenu(loader.resources['img/images.json'].textures['menuStair2.png']);
    container.addChild(btn2.getSprite());
    btn2.getSprite().position.set(130, 0);

    const btn3 = new BtnMenu(loader.resources['img/images.json'].textures['menuStair3.png']);
    container.addChild(btn3.getSprite());
    btn3.getSprite().position.set(260, 0);

    btn1.getButton().on('mousedown', btn1DownListener);
    btn1.getButton().on('touchstart', btn1DownListener);
    btn2.getButton().on('mousedown', btn2DownListener);
    btn2.getButton().on('touchstart', btn2DownListener);
    btn3.getButton().on('mousedown', btn3DownListener);
    btn3.getButton().on('touchstart', btn3DownListener);

    function btn1DownListener()
    {
        btn1.select();
        btn2.unselect();
        btn3.unselect();
        callback1();
    }

    function btn2DownListener()
    {
        btn1.unselect();
        btn2.select();
        btn3.unselect();
        callback2();
    }

    function btn3DownListener()
    {
        btn1.unselect();
        btn2.unselect();
        btn3.select();
        callback3();
    }

    btn1.getOk().on('mousedown', okListener);
    btn1.getOk().on('touchstart', okListener);
    btn2.getOk().on('mousedown', okListener);
    btn2.getOk().on('touchstart', okListener);
    btn3.getOk().on('mousedown', okListener);
    btn3.getOk().on('touchstart', okListener);

    function okListener()
    {
        btn1.unselect();
        btn2.unselect();
        btn3.unselect();
        callbackOk();
    }

    me.show = function()
    {
        btn1.show();
        setTimeout(btn2.show, 50);
        setTimeout(btn3.show, 100);
    };

    me.getSprite = function()
    {
        return container;
    };
}

function BtnMenu(texture)
{
    const me = this;
    const container = new PIXI.Container();
    container.pivot.set(69, 65);
    container.scale.set(0, 0);
    container.alpha = 0;
    const sprBg = new PIXI.Sprite(loader.resources['img/images.json'].textures['menuBack.png']);

    const hit = new PIXI.Graphics();
    hit.beginFill(0xff0000, 1);
    hit.drawCircle(69, 65, 58);
    hit.endFill();
    hit.alpha = 0;
    container.addChild(hit);
    hit.interactive = true;

    container.addChild(sprBg);
    const sprSelected = new PIXI.Sprite(loader.resources['img/images.json'].textures['menuChoosed.png']);
    sprSelected.alpha = 0;
    sprSelected.position.set(9, 6);
    container.addChild(sprSelected);
    const sprImage = new PIXI.Sprite(texture);
    sprImage.position.set(25, 20);
    container.addChild(sprImage);

    const sprOk = new PIXI.Sprite(loader.resources['img/images.json'].textures['menuOk.png']);
    sprOk.anchor.set(0.5, 0);
    sprOk.alpha = 0;
    sprOk.position.set(69, 110);
    container.addChild(sprOk);

    let selected = false;

    me.getSprite = function()
    {
        return container;
    };

    me.getButton = function()
    {
        return hit;
    };

    me.getOk = function()
    {
        return sprOk;
    };

    me.select = function()
    {
        if (selected) return;
        selected = true;
        sprOk.interactive = true;

        sprOk.scale.set(0, 0);
        sprOk.alpha = 0;
        sprSelected.alpha = 0;
        t2 = 0;
        app.ticker.remove(stepSelect);
        app.ticker.add(stepSelect);
    };

    me.unselect = function()
    {
        if (! selected) return;
        selected = false;
        sprOk.interactive = false;

        t2 = 0;
        app.ticker.remove(stepSelect);
        app.ticker.add(stepSelect);
    };

    let t2 = 0;
    let dt2 = 0.05;
    function stepSelect()
    {
        t2 += dt2;
        if (selected)
        {
            const scale = easeOutCubic(t2);
            sprOk.scale.set(scale, scale);
            sprOk.alpha = t2;
            sprSelected.alpha = t2;
        }
        else
        {
            sprOk.alpha = 1 - t2 * 2;
            sprSelected.alpha = 1 - t2 * 2;
        }

        if (t2 >= 1) app.ticker.remove(stepSelect);
    }

    me.show = function()
    {
        app.ticker.add(stepShow);
    };

    let t = 0;
    let dt = 0.05;
    function stepShow()
    {
        t += dt;
        const scale = easeOutCubic(t);
        container.scale.set(scale, scale);
        container.alpha = t * 2;

        if (t >= 1) app.ticker.remove(stepShow);
    }
}

function BtnHammer(callback)
{
    const me = this;
    const container = new PIXI.Container();
    container.pivot.set(53, 129);

    const hit = new PIXI.Graphics();
    hit.beginFill(0xff0000, 1);
    hit.drawCircle(53, 48, 47);
    hit.endFill();
    hit.alpha = 0;
    container.addChild(hit);
    hit.interactive = true;

    const sprite = new PIXI.Sprite(loader.resources['img/images.json'].textures['hammer.png']);
    container.addChild(sprite);
    container.scale.set(0, 0);
    container.alpha = 0;

    let visible = false;

    me.getSprite = function()
    {
        return container;
    };

    me.show = function()
    {
        visible = true;
        app.ticker.add(step);
    };

    me.hide = function()
    {
        visible = false;
        app.ticker.add(step);
    };

    let t = 0;
    let dt = 0.015;
    function step()
    {
        t += dt;

        if (visible)
        {
            const scale = easeElasticFromZero(t);
            container.scale.set(scale, scale);
            container.alpha = t * 4;
        }
        else
        {
            container.alpha = 1 - t * 6;
        }

        if (t >= 1) app.ticker.remove(step);
    }

    hit.on('mousedown', downListener);
    hit.on('touchstart', downListener);

    function downListener()
    {
        me.hide();
        sprite.off('mousedown', downListener);
        sprite.off('touchstart', downListener);
        callback();
    }
}

function Stairs()
{
    const me = this;
    const container = new PIXI.Container();

    const spr0 = new PIXI.Sprite(loader.resources['img/images.json'].textures['oldStair.png']);
    spr0.anchor.set(0, 1);
    spr0.defPos = {x: 20, y: 640-15};
    spr0.position.set(spr0.defPos.x, spr0.defPos.y);
    const spr1 = new PIXI.Sprite(loader.resources['img/images.json'].textures['newStair1.png']);
    spr1.anchor.set(0, 1);
    spr1.defPos = {x: 0, y: 640};
    spr1.position.set(spr0.defPos.x, spr0.defPos.y);
    const spr2 = new PIXI.Sprite(loader.resources['img/images.json'].textures['newStair2.png']);
    spr2.anchor.set(0, 1);
    spr2.defPos = {x: 0, y: 640};
    spr2.position.set(spr0.defPos.x, spr0.defPos.y);
    const spr3 = new PIXI.Sprite(loader.resources['img/images.json'].textures['newStair3.png']);
    spr3.anchor.set(0, 1);
    spr3.defPos = {x: 0, y: 640};
    spr3.position.set(spr0.defPos.x, spr0.defPos.y);

    let sprCurrent = spr0;
    container.addChild(spr0);

    me.getSprite = function()
    {
        return container;
    };

    me.set0 = function()
    {
        show(spr0);
    };

    me.set1 = function()
    {
        show(spr1);
    };

    me.set2 = function()
    {
        show(spr2);
    };

    me.set3 = function()
    {
        show(spr3);
    };

    let sprOld;
    let t = 0;
    let dt = 0.1;
    let fallHeight = 80;
    function show(sprNew)
    {
        app.ticker.remove(step);

        if (sprNew == sprCurrent) return;
        if (sprOld && sprOld.parent) container.removeChild(sprOld);
        sprOld = sprCurrent;
        sprCurrent = sprNew;
        t = 0;
        sprCurrent.position.x = sprCurrent.defPos.x;
        sprCurrent.position.y = sprCurrent.defPos.y - fallHeight;
        container.addChild(sprCurrent);

        app.ticker.add(step);
    }

    function step()
    {
        t += dt;
        if (t <= 1)
        {
            sprCurrent.position.y = sprCurrent.defPos.y - fallHeight * (1 - t * t);
            sprCurrent.alpha = 2 * t;
            sprOld.alpha = 1 - 2 * t;
        }
        else if (t <= 11)
        {
            sprCurrent.scale.y = 1 - easeElastic((t - 1) / 30);
        }
        else
        {
            app.ticker.remove(step);
        }
    }
}

function easeElastic(t)
{
    if (t < 0) return 0;
    if (t > 1) return 0;
    return Math.pow(2, -10 * (t * 3 + 0.075)) * Math.sin(((t * 3 + 0.075) * 10 - 0.75) * (2 * Math.PI) / 3) / 6;
}

function easeElasticFromZero(t)
{
    if (t < 0) return 0;
    if (t > 1) return 1;

    return Math.pow(2, -10 * t) *  Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
}

function easeOutBack(t)
{
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeOutCubic(t)
{
    return 1 - Math.pow(1 - t, 3);
}

window.addEventListener('resize', resizeListener);
function resizeListener()
{
    let newWidth, newHeight;

    if (window.innerWidth / window.innerHeight > startRatio)
    {
        newWidth = window.innerWidth;
        newHeight = newWidth / startRatio;

        //newHeight = window.innerHeight;
        //newWidth = newHeight * startRatio;
    }
    else
    {
        newHeight = window.innerHeight;
        newWidth = newHeight * startRatio;

        //newWidth = window.innerWidth;
        //newHeight = newWidth / startRatio;
    }

    container.scale.set(newWidth / startWidth, newHeight / startHeight);
    container.x = (window.innerWidth - newWidth) / 2;
    container.y = (window.innerHeight - newHeight) / 2;
}
