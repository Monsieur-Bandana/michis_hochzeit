import { Application, Assets, Sprite, BitmapText, Container } from "pixi.js";
import { sound } from "@pixi/sound";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "white", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  // Load Assets
  await Assets.load([
    { alias: "soundtrack", src: "assets/soundtrack.mp3" },
    { alias: "michi", src: "assets/michi.png" },
    { alias: "font", src: "assets/Kalufira.otf" },
    { alias: "bereit", src: "assets/bereit.png" },
    { alias: "herz", src: "assets/herz.png" },
    { alias: "geiger", src: "assets/geiger.png" },
  ]);

  // Soundtrack
  const audioBuffer = Assets.get("soundtrack");
  sound.add("background", audioBuffer);
  sound.play("background", { loop: true });

  // Michi
  const michi = new Sprite(Assets.get("michi"));
  michi.anchor.set(0.5);
  michi.scale.set(2);
  michi.y = app.screen.height - app.screen.height / 4;
  michi.x = app.screen.width - app.screen.width * 0.99;
  app.stage.addChild(michi);

  // Geiger
  const geiger = new Sprite(Assets.get("geiger"));
  geiger.anchor.set(0.5);
  geiger.scale.set(0.1);
  geiger.y = app.screen.height / 4;
  geiger.x = app.screen.width + 60;
  app.stage.addChild(geiger);

  // Bereit Button
  const bereit = new Sprite(Assets.get("bereit"));
  bereit.anchor.set(0.5);
  bereit.scale.set(0.07);
  bereit.y = app.screen.height - app.screen.height / 4;
  bereit.x = app.screen.width + 60;
  app.stage.addChild(bereit);
  bereit.eventMode = "static";

  // Leben
  const livesContainer = new Container();
  const heartscale = 0.01;
  const life1 = new Sprite("herz.png");
  life1.scale = heartscale;
  const life2 = new Sprite("herz.png");
  life2.scale = heartscale;
  const life3 = new Sprite("herz.png");
  life3.scale = heartscale;
  life2.x = life1.width + 8;
  life3.x = (life1.width + 8) * 2;
  livesContainer.addChild(life1, life2, life3);
  livesContainer.x = 20;
  livesContainer.y = 20;
  app.stage.addChild(livesContainer);

  // lässt die Charaktäre reinsliden
  function slideIn(character, direction) {
    return new Promise((resolve) => {
      var x_value = 0;
      direction == "left"
        ? (x_value = app.screen.width / 4)
        : (x_value = app.screen.width - app.screen.width / 4);
      const targetX = x_value;
      const speed = 0.7; // px pro Frame – ggf. anpassen
      app.ticker.add(function move() {
        const delta = app.ticker.deltaMS;
        direction == "left"
          ? (character.x += speed * delta)
          : (character.x -= speed * delta);
        var boolVal = false;
        direction == "left"
          ? (boolVal = character.x >= targetX)
          : (boolVal = character.x <= targetX);
        if (boolVal) {
          character.x = targetX;
          app.ticker.remove(move); // Bewegung stoppen
          resolve();
        }
      });
    });
  }

  function showText(text) {
    return new Promise((resolve) => {
      const text1 = new BitmapText({
        text: text,
        style: { fontFamily: "font", fontSize: 10, fill: "black" },
      });
      text1.anchor.set(0.5);
      text1.scale.set(2);
      text1.y = app.screen.height / 3;
      text1.x = app.screen.width / 2;
      app.stage.addChild(text1);
      setTimeout(() => {
        app.stage.removeChild(text1);
        resolve();
      }, 1000);
    });
  }

  function wait(t) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  // Begrüsung
  const text1 = "Lieber Michi!";
  const text2 = "Herzlichen Glückwunsch\nzur gelungenen Hochzeit!";
  const text3 = "Zur Feier dieses Ereignisses\nsteht das Spiel des Lebens an";
  const text4 = "Am Ende wartet auch ein Preis auf dich";
  const text5 = "Bist du bereit?";

  await slideIn(michi, "left");
  await showText(text1);
  await showText(text2);
  await showText(text3);
  await showText(text4);
  await showText(text5);
  await slideIn(bereit, "right");
  await new Promise((resolve) => {
    bereit.on("pointerdown", () => {
      resolve();
    });
  });
  app.stage.removeChild(bereit);
  await slideIn(geiger, "right");
  await wait(50);
  await showText("Herausforderung 1:\nGeigenunterricht");
})();
