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
    { alias: "deutscher", src: "assets/deutscher.png" },
    { alias: "bubble", src: "assets/speechbubble.png" },
    { alias: "bachelor", src: "assets/bachelor.png" },
    { alias: "weiter", src: "assets/Weiter.png" },
    { alias: "fabrik", src: "assets/fabrik.png" },
    { alias: "schatz", src: "assets/schatz.png" },
    { alias: "thanos", src: "assets/thanos.png" },
    { alias: "bowser", src: "assets/bowser.mp3" },
  ]);

  const right = "right";
  const left = "left";
  var numberOfLifes = 3;
  var cur_challenge = 1;
  var currentAnswerStatus = false;
  var curr_enemy;

  // Soundtrack
  const audioBuffer = Assets.get("soundtrack");
  sound.add("background", audioBuffer);
  sound.play("background", { loop: true, volume: 0.3 });

  // Bowserlachen
  const audioBuffer2 = Assets.get("bowser");
  sound.add("villain", audioBuffer2);

  // Michi
  const michi = new Sprite(Assets.get("michi"));
  michi.name = "michi";
  michi.anchor.set(0.5);
  michi.scale.set(2);
  michi.y = app.screen.height - app.screen.height / 4;
  michi.x = app.screen.width - app.screen.width * 0.99;
  app.stage.addChild(michi);

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
  function slideIn(character, direction, dest = 4) {
    return new Promise((resolve) => {
      var x_value = 0;
      direction == "left"
        ? (x_value = app.screen.width / dest)
        : (x_value = app.screen.width - app.screen.width / dest);
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

  // generiert die Antwortmöglichkeiten
  function createText(text, h) {
    const text1 = new BitmapText({
      text: text,
      style: { fontFamily: "font", fontSize: 10, fill: "black" },
    });
    text1.anchor.set(0.5);
    text1.scale.set(2);
    text1.y = app.screen.height - app.screen.height / 4 + h;
    text1.x = app.screen.width + 60;
    text1.eventMode = "static";

    app.stage.addChild(text1);
    slideIn(text1, "right");
    return text1;
  }

  // erzeugt eine Sterbeanimation der Gegner
  async function deathAnimation(el) {
    app.ticker.add((time) => {
      new Promise((resolve) => {
        time = 10000;
        el.rotation += 0.1 * time.deltaTime;
        resolve();
      });
    });
  }

  // diese Funktion leitet die nächste Runde ein, wenn
  // Frage richtig beantwortet
  async function winFunction() {
    // Alle Elemente außer "michi" aus der Stage entfernen
    return new Promise(async (resolve) => {
      if (curr_enemy != null) {
        await deathAnimation(curr_enemy);
      }
      await new Promise((resolve) => {
        showText("Gratuliere, du darfst weiterleben", true);
        setTimeout(() => {
          resolve();
        }, 1500);
      });
      for (const child of app.stage.children.slice()) {
        if (child.name !== "michi") {
          app.stage.removeChild(child);
        }
      }
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }

  async function restartfunction() {
    // Bereit Button
    const thanos = new Sprite(Assets.get("thanos"));
    thanos.anchor.set(0.5);
    thanos.scale.set(0.2);
    thanos.y = app.screen.height / 2;
    thanos.x = app.screen.width / 2;
    app.stage.addChild(thanos);

    sound.play("villain", { loop: false });

    function scaleUp(sprite, targetScale = 2, speed = 0.1) {
      return new Promise((resolve) => {
        app.ticker.add(function grow() {
          sprite.scale.x += speed;
          sprite.scale.y += speed;
          if (sprite.scale.x >= targetScale) {
            sprite.scale.set(targetScale);
            app.ticker.remove(grow);
            resolve();
          }
        });
      });
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
    // Verwendung:
    await scaleUp(thanos, 10, 0.06);

    numberOfLifes = 3;
    return await new Promise(async (resolve) => {
      await new Promise((resolve) => {
        showText("Das war dein letztes Leben!", false, 2, "white");
        setTimeout(() => {
          resolve();
        }, 1500);
      });
      for (const child of app.stage.children.slice()) {
        if (child.name !== "michi") {
          app.stage.removeChild(child);
        }
      }
      setTimeout(() => {
        resolve();
      }, 10);
      await showText("Auf ein Neues!\nDiesmal klappts bestimmt!");
      restartGame();
    });
  }

  async function looseFunction(an1, an2, an3, resolve) {
    showText("Schade! Du verlierst ein Leben!");
    numberOfLifes--;
    console.log(numberOfLifes);
    if (numberOfLifes <= 0) {
      console.log("i was here!");

      await restartfunction();
      return resolve("gameover");
    } else {
      await waitForAnswer(an1, an2, an3, resolve);
    }
  }

  async function waitForAnswer(an1, an2, an3, resolve) {
    return new Promise((resolve) => {
      an1.on("pointerdown", async () => {
        await winFunction();
        resolve("win");
      });
      an2.on("pointerdown", async () => {
        await looseFunction(an1, an2, an3, resolve);
      });
      an3.on("pointerdown", async () => {
        await looseFunction(an1, an2, an3, resolve);
      });
    });
  }

  async function showAnswers(answerCorrect, answerWrong1, answerWrong2) {
    const text10 = createText(answerCorrect, 80);
    const text20 = createText(answerWrong1, 40);
    const text30 = createText(answerWrong2, 0);
    await waitForAnswer(text10, text20, text30);
  }

  function showText(text, steady = false, height = 3, color = "black") {
    return new Promise((resolve) => {
      const text1 = new BitmapText({
        text: text,
        style: { fontFamily: "font", fontSize: 10, fill: color },
      });
      text1.anchor.set(0.5);
      text1.scale.set(2);
      text1.y = app.screen.height / height;
      text1.x = app.screen.width / 2;
      app.stage.addChild(text1);
      if (steady) {
        resolve();
      } else {
        setTimeout(() => {
          app.stage.removeChild(text1);
          resolve();
        }, 150); //1500
      }
    });
  }

  async function executeFight(
    enemy_str,
    number,
    title,
    question,
    optionCorrect,
    option2,
    option3,
    enemy_position = 4
  ) {
    // Gegnergenerierung
    const enemy = new Sprite(Assets.get(enemy_str));
    enemy.anchor.set(0.5);
    enemy.scale.set(0.1);
    enemy.y = app.screen.height / 4;
    enemy.x = app.screen.width + 60;
    app.stage.addChild(enemy);
    curr_enemy = enemy;

    // Sprechblase
    const sp_b = new Sprite(Assets.get("bubble"));
    sp_b.anchor.set(0.5);
    sp_b.scale.set(0.1);
    sp_b.y = app.screen.height / 2;
    sp_b.x = app.screen.width + 160;
    app.stage.addChild(sp_b);

    await slideIn(enemy, "right", enemy_position);
    await wait(200);
    await showText(`Herausforderung ${number}:\n${title}`, false, 2);
    await slideIn(sp_b, "right", 2);
    await showText(question, true, 2);
    await showAnswers(optionCorrect, option2, option3);
    cur_challenge++;
    console.log(cur_challenge);
  }

  function wait(t) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, t);
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

  async function restartGame() {
    // Bereit Button
    const bereit = new Sprite(Assets.get("bereit"));
    bereit.anchor.set(0.5);
    bereit.scale.set(0.07);
    bereit.y = app.screen.height - app.screen.height / 4;
    bereit.x = app.screen.width + 60;
    app.stage.addChild(bereit);
    bereit.eventMode = "static";
    await showText(text5);
    await slideIn(bereit, "right");
    await new Promise((resolve) => {
      bereit.on("pointerdown", () => {
        resolve();
      });
    });
    app.stage.removeChild(bereit);
    await executeFight(
      "geiger",
      cur_challenge,
      "Geigenunterricht",
      "Wer ist der beste Komponist?",
      "Dvorak",
      "Bach",
      "Mozart"
    );
    await executeFight(
      "deutscher",
      cur_challenge,
      "Deutsch lernen",
      "Welcher dieser Ausdrücke\nist der einzig\ngrammatikalisch Korrekte,\nder Erstaunen signalisiert?",
      "Oida!",
      "Erstaunlich!",
      "Welch Wunder!",
      3
    );
    await executeFight(
      "bachelor",
      cur_challenge,
      "Wirtschaftswissenschaften",
      "An welchem Ort\nlernt es sich am besten?",
      "Biertümpel",
      "Zentralbibliothek",
      "Audimax",
      3
    );
    await executeFight(
      "fabrik",
      cur_challenge,
      "Fabrikleitung",
      "Wer hat die besten Tüten?",
      "Ein Typ aus Madiun",
      "Wonderwoman",
      "Bob Marley",
      3
    );
  }

  await restartGame();
  await showText("Herzlichen Glückwunsch");
  await showText("Du hast alle Herausforderungen\nmit Bravur gemeistert!");
  await showText("Hier deine Belohnung");
  await showText("(Bitte anklicken)", true);

  const schatz = new Sprite(Assets.get("schatz"));
  schatz.anchor.set(0.5);
  schatz.scale.set(0.2);
  schatz.y = app.screen.height / 2;
  schatz.x = app.screen.width / 2;
  app.stage.addChild(schatz);
  schatz.eventMode = "static";
  const htmlBox = document.createElement("div");
  htmlBox.classList.add("pp_form");
  document.body.appendChild(htmlBox);
  schatz.on("pointerdown", () => {
    //  htmlBox.style.display = "block";
  });
})();
