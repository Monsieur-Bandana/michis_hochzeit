import { Application, Assets, Sprite, Container, Text } from "pixi.js";
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
    { alias: "magneto", src: "assets/magneto.mp3" },
    { alias: "romeo", src: "assets/romeo.mp3" },
    { alias: "michi", src: "assets/michi.png" },
    { alias: "font", src: "fonts/ArcadeClassic.ttf" },
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
    { alias: "paypal", src: "assets/paypal_button.png" },
    { alias: "shock", src: "assets/shock.png" },
  ]);

  const right = "right";
  const left = "left";
  var numberOfLifes = 3;
  var cur_challenge = 1;
  var currentAnswerStatus = false;
  var curr_enemy;
  var curr_sb;
  var curr_q;
  var curr_o1;
  var curr_o2;
  var curr_o3;
  var michis_user_name = "";
  var michis_mail = "puriwild@googlemail.com";

  // Setup der Fragestellungen
  const geigenfrage1 = {
    question: "Wer ist der beste Komponist?",
    optionCorrect: "Dvorak",
    option2: "Bach",
    option3: "Mozart",
  };
  const deutschfrage1 = {
    question: "Was sagt man überlicherweise\num Erstaunen auszudrücken?",
    optionCorrect: "Oida!",
    option2: "Erstaunlich!",
    option3: "Welch Wunder!",
  };
  const bachelorfrage1 = {
    question: "An welchem Ort\nlernt es sich am besten?",
    optionCorrect: "Biertümpel",
    option2: "Zentralbibliothek",
    option3: "Audimax",
  };
  const bachelorfrage2 = {
    question: "Wie ist das Wetter?",
    optionCorrect: "Kiesewettrig",
    option2: "Regnerisch",
    option3: "Sonnig",
  };
  const fabrikfrage1 = {
    question: "Wer hat die besten Tüten?",
    optionCorrect: "Ein Typ aus Madiun",
    option2: "Wonderwoman",
    option3: "Bob Marley",
  };
  const fabrikfrage2 = {
    question: "Wo liegt Madiun?",
    optionCorrect: "Neuseeland",
    option2: "Java",
    option3: "Sumatra",
  };

  // Soundtrack
  const audioBuffer = Assets.get("soundtrack");
  sound.add("background", audioBuffer);
  const audioBuffer2 = Assets.get("magneto");
  sound.add("background2", audioBuffer2);
  const audioBuffer4 = Assets.get("romeo");
  sound.add("background3", audioBuffer4);

  // Bowserlachen
  const audioBuffer3 = Assets.get("bowser");
  sound.add("villain", audioBuffer3);

  // Michi
  const michi = new Sprite(Assets.get("michi"));
  michi.name = "michi";
  michi.anchor.set(0.5);
  michi.scale.set(2);
  michi.y = app.screen.height - app.screen.height / 4;
  michi.x = app.screen.width - app.screen.width * 0.99;
  app.stage.addChild(michi);

  // Leben
  function createLives() {
    var generatorNum = 0;
    var heartPosition = 0;
    while (generatorNum < numberOfLifes) {
      const heart = new Sprite(Assets.get("herz"));
      heart.anchor.set(0.5);
      heart.scale.set(0.025);
      heart.label = "heart";
      heart.y = app.screen.height / 8;
      heart.x = app.screen.width / 4 + heartPosition;
      app.stage.addChild(heart);
      generatorNum++;
      heartPosition += 50;
    }
  }

  function updateLives() {
    new Promise((resolve) => {
      for (const child of app.stage.children.slice()) {
        if (child.label === "heart") {
          app.stage.removeChild(child);
        }
      }
      setTimeout(() => {
        resolve();
      }, 10);
    });

    createLives();
  }

  // lässt die Charaktäre reinsliden
  function slideIn(character, direction, dest = 4, target_x = 0) {
    return new Promise((resolve) => {
      var x_value = 0;
      direction == "left"
        ? (x_value = app.screen.width / dest)
        : (x_value = app.screen.width - app.screen.width / dest);
      var targetX = 0;
      target_x == 0 ? (targetX = x_value) : (targetX = target_x);
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

  async function slideOut(character) {
    const desti = app.screen.width + 1000;
    await slideIn(character, "left", 4, desti);
  }

  function createGenericText(
    text,
    x_axis,
    y_axis,
    slideInAnimation = true,
    dest = "set"
  ) {
    const text1 = new Text({
      text,
      style: {
        fontFamily: "ArcadeClassic",
        fontSize: 10,
        fill: "black",
        resolution: 2,
      },
    });
    text1.anchor.set(0.5);
    text1.scale.set(2);
    text1.y = y_axis;

    text1.x = slideInAnimation ? app.screen.width + 60 : app.screen.width / 2;

    text1.eventMode = "static";

    app.stage.addChild(text1);
    if (slideInAnimation) {
      dest == "unset"
        ? slideIn(text1, "right", 10)
        : slideIn(text1, "right", 10, x_axis);
    }
    return text1;
  }

  // generiert die Antwortmöglichkeiten
  function createText(text, h, slideInAnimation = true) {
    const y = app.screen.height - app.screen.height / 4 + h;

    const x = slideInAnimation
      ? app.screen.width - app.screen.width / 4
      : app.screen.width / 2;

    const text1 = createGenericText(text, x, y, slideInAnimation);
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

  async function removeEveryItemFromScreen({ except = "2343242342344234" }) {
    return new Promise((resolve) => {
      for (const child of app.stage.children.slice()) {
        if (child.name !== except) {
          app.stage.removeChild(child);
        }
      }
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }

  // diese Funktion leitet die nächste Runde ein, wenn
  // Frage richtig beantwortet
  async function winFunction(stay_in_arena) {
    if (stay_in_arena) {
      return new Promise(async (resolve) => {
        app.stage.removeChild(curr_q);
        var counter = 1;
        for (const el of [curr_q, curr_o1, curr_o2, curr_o3]) {
          slideOut(el);
        }
        await slideOut(curr_sb);
        resolve();
      });
    }
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
      await removeEveryItemFromScreen({ except: "michi" });
      resolve();
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
    await scaleUp(thanos, 6, 0.01);

    numberOfLifes = 3;
    return await new Promise(async (resolve) => {
      await new Promise((resolve) => {
        showText("Das war dein letztes Leben!", false, 2, "white");
        setTimeout(() => {
          resolve();
        }, 1500);
      });
      removeEveryItemFromScreen("michi");
      await showText("Auf ein Neues!\nDiesmal klappts bestimmt!");
      restartGame();
    });
  }

  async function looseFunction(an1, an2, an3, resolve) {
    showText("Schade! Du verlierst ein Leben!");
    numberOfLifes--;
    console.log(numberOfLifes);
    updateLives();
    if (numberOfLifes <= 0) {
      console.log("i was here!");

      await restartfunction();
      return resolve("gameover");
    } /*else {
      await waitForAnswer(an1, an2, an3, resolve);
    }*/
  }

  async function waitForAnswer(an1, an2, an3, stay_in_arena, resolve) {
    return new Promise((resolve) => {
      an1.on("pointerdown", async () => {
        await winFunction(stay_in_arena);
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

  async function showAnswers(
    answerCorrect,
    answerWrong1,
    answerWrong2,
    stay_in_arena
  ) {
    const text10 = createText(answerCorrect, 80);
    const text20 = createText(answerWrong1, 40);
    const text30 = createText(answerWrong2, 0);
    curr_o1 = text10;
    curr_o2 = text20;
    curr_o3 = text30;
    await waitForAnswer(text10, text20, text30, stay_in_arena);
  }

  function showText(text, steady = false, height = 3, color = "black") {
    return new Promise((resolve) => {
      const text1 = new Text({
        text,
        style: { fontFamily: "ArcadeClassic", fontSize: 10, fill: color },
        resolution: 2,
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

  async function executeFight({
    enemy_str,
    title,
    question_map_list,
    enemy_position = 4,
    enemy_scale = 0.1,
  }) {
    // Gegnergenerierung
    const enemy = new Sprite(Assets.get(enemy_str));
    enemy.anchor.set(0.5);
    enemy.scale.set(enemy_scale);
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
    curr_sb = sp_b;

    await slideIn(enemy, "right", enemy_position);
    await wait(200);
    await showText(`Herausforderung ${cur_challenge}:\n${title}`, false, 2);
    var counter = 1;
    var stay_in_arena = true;
    for (const el of question_map_list) {
      console.log(el);
      await slideIn(sp_b, "right", 2);
      curr_q = createGenericText(
        el.question,
        app.screen.width / 2,
        app.screen.height / 1.95
      );

      if (question_map_list.length == counter) {
        stay_in_arena = false;
      }
      await showAnswers(
        el.optionCorrect,
        el.option2,
        el.option3,
        stay_in_arena
      );
      counter++;
    }
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

  const text5 = "Bist du bereit?";
  const introTexts = [
    "Lieber Michi!",
    "Herzlichen Glückwunsch\nzur gelungenen Hochzeit!",
    "Das war wirklich ein\ntoller Abend.",
    "Auf deinem bisherigen\nWeg durchs Leben ...",
    "... hast du schon viele\nPrüfungen gemeistert.",
    "Heute musst du dich noch\neinmal vier deiner erbittersten\nGegener stellen.",
    "Am Ende wartet ein Preis auf dich",
    text5,
  ];

  async function generateIntroTexts(listOfTexts) {
    for (const el of listOfTexts) {
      await showText(el);
    }
  }

  await slideIn(michi, "left");
  // Begrüsung
  await generateIntroTexts(introTexts);

  async function sendMail(body_t) {
    // mail code here

    try {
      await fetch("", {
        method: "POST",
        headers: { "Content-Type": "Michis-Hochzeits-App" },
        body: JSON.stringify({
          to: "nicolas.wild@googlemail.com",
          replyTo: michis_mail,
          message: body_t,
        }),
      });

      removeEveryItemFromScreen({});
      showText(
        "Anfrage erfolgreich versendet!\nDu kannst die App jetzt schließen!",
        true
      );
    } catch (e) {
      console.error(e);
      showText("Senden fehlgeschlagen.\nBitte später erneut versuchen.", true);
    }
  }

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

    sound.play("background", { loop: true, volume: 0.3 });
    createLives();
    await executeFight({
      enemy_str: "geiger",
      title: "Geigenunterricht",
      question_map_list: [geigenfrage1],
      enemy_scale: 0.15,
    });
    await executeFight({
      enemy_str: "deutscher",
      title: "Deutsch lernen",
      question_map_list: [deutschfrage1],
      enemy_position: 3,
    });
    sound.stop("background");
    sound.play("background2");
    await executeFight({
      enemy_str: "bachelor",
      title: "Wirtschaftswissenschaften",
      question_map_list: [bachelorfrage1, bachelorfrage2],
      enemy_position: 3,
    });

    const markusTexts = [
      "Hallo Michael!",
      "Klasse wie gut du vorankommst.",
      "Zur Feier des Tages\nspendiere ich dir ...",
      "... ein Extra Leben!",
      "Viel Erfolg weiterhin",
      "Ah und das akademische Orchester\nhat stets eine Tür offen für dich",
    ];

    await generateIntroTexts(markusTexts);
    numberOfLifes++;
    updateLives();

    sound.stop("background2");

    sound.play("background3");
    await executeFight({
      enemy_str: "fabrik",
      title: "Fabrikleitung",
      question_map_list: [fabrikfrage2, fabrikfrage1],
      enemy_position: 3,
      enemy_scale: 0.25,
    });

    sound.stop("background3");
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

  await new Promise((resolve) => {
    schatz.on("pointerdown", () => {
      resolve();
    });
  });
  await removeEveryItemFromScreen({});
  await showText("Name deines Nutzeraccounts", true, 4.5);
  await showText("E-Mail deines Nutzeraccounts", true, 3);
  const paypal = new Sprite(Assets.get("paypal"));
  paypal.anchor.set(0.5);
  paypal.scale.set(0.1);
  paypal.y = app.screen.height / 2;
  paypal.x = app.screen.width / 2;
  app.stage.addChild(paypal);
  paypal.eventMode = "static";
  paypal.on("pointerdown", () => {
    sendMail(
      `paypal Anfrage\nAdresse: ${michis_mail}\nName: ${michis_user_name}`
    );
  });

  const shock = new Sprite(Assets.get("shock"));
  shock.anchor.set(0.5);
  shock.scale.set(0.3);
  shock.y = app.screen.height / 1.5;
  shock.x = app.screen.width / 2;
  app.stage.addChild(shock);
  const no_pp_request = createText(
    "Wie du hast kein Paypal?!\nBitte hier klicken",
    20,
    false
  );
  no_pp_request.on("pointerdown", () => {
    sendMail(
      `Habe leider kein Paypal, schreib mir am besten auf Whatsapp\nGrüße ${michis_user_name}`
    );
  });
})();
