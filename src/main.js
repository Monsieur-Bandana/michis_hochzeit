import { Application, Assets, Sprite, Container, Text } from "pixi.js";
import { sound } from "@pixi/sound";
import { Input } from "@pixi/ui";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "white", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  const assetlist = [
    { alias: "soundtrack", src: "assets/soundtrack.mp3" },
    { alias: "magneto", src: "assets/magneto.mp3" },
    { alias: "romeo", src: "assets/romeo.mp3" },
    { alias: "adagio", src: "assets/adagio.mp3" },
    { alias: "victory", src: "assets/victory.mp3" },
    { alias: "michi", src: "assets/michi.png" },
    //  { alias: "font", src: "fonts/ArcadeClassic.ttf" },
    { alias: "font", src: "fonts/Pixelletters.ttf" },
    { alias: "font", src: "fonts/GloriousFree.ttf" },
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
    { alias: "markus", src: "assets/markus_rotated.png" },
    { alias: "arena3", src: "assets/arena3.png" },
    { alias: "arena2", src: "assets/arena2.png" },
    { alias: "arena1", src: "assets/arena1.png" },
    { alias: "input", src: "assets/input.png" },

    //{ alias: "arena4", src: "assets/arena4.png" },
    { alias: "error_mes", src: "assets/error_mes.png" },
    { alias: "error_mes2", src: "assets/error_mes2.png" },
  ];

  app.ticker.maxFPS = 24;

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
        fontFamily: "Pixelletters",
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

  // 1) einmal erstellen & anzeigen
  let loadText = createGenericText(
    "lade ... 0%",
    app.screen.width / 2,
    app.screen.height / 2,
    false
  );
  app.stage.addChild(loadText);

  // 2) pro Asset laden und Prozent updaten
  const total = assetlist.length;
  let loaded = 0;

  for (const el of assetlist) {
    await Assets.load(el); // wartet auf einzelnes Asset
    loaded++;
    const pct = Math.min(100, Math.round((loaded / total) * 100));
    loadText.text = `lade ... ${pct}%`;
  }

  app.stage.removeChild(loadText);

  const right = "right";
  const left = "left";
  var numberOfLifes = 3;
  var cur_challenge = 1;
  var currentAnswerStatus = false;
  var curr_michi;
  var curr_enemy;
  var curr_sb;
  var curr_q;
  var curr_o1;
  var curr_o2;
  var curr_o3;
  var michael_data = {
    michis_name: "",
    michis_mail: "",
    sicherheits_antwort: "",
  };

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
  const deutschfrage2 = {
    question: "Was ist ein bekanntes\ndeutsches Volkslied?",
    optionCorrect: "Ich fühl mich Disko",
    option2: "Oh Tannenbaum",
    option3: "Die Vogelhochzeit",
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
  const fabrikfrage3 = {
    question: "Warum ist Indonesien ein\nbesserer Standort als Deutschland?",
    optionCorrect: "Deutschland hat\nkein Timezone",
    option2: "Billige Arbeitskräfte",
    option3: "Nähe zur Familie",
  };

  // Soundtrack
  const audioBuffer = Assets.get("soundtrack");
  sound.add("background", audioBuffer);
  const audioBuffer2 = Assets.get("magneto");
  sound.add("background2", audioBuffer2);
  const audioBuffer4 = Assets.get("romeo");
  sound.add("background3", audioBuffer4);
  const audioBuffer5 = Assets.get("adagio");
  sound.add("background4", audioBuffer5);
  const audioBuffer6 = Assets.get("victory");
  sound.add("background5", audioBuffer6);

  // Bowserlachen
  const audioBuffer3 = Assets.get("bowser");
  sound.add("villain", audioBuffer3);

  function addBackground(background_img) {
    // Create a background sprite.
    const background = Sprite.from(background_img);

    // Center background sprite anchor.
    background.anchor.set(0.5);

    /**
     * If the preview is landscape, fill the width of the screen
     * and apply horizontal scale to the vertical scale for a uniform fit.
     */
    if (app.screen.width > app.screen.height) {
      background.width = app.screen.width * 1.2;
      background.scale.y = background.scale.x;
    } else {
      /**
       * If the preview is square or portrait, then fill the height of the screen instead
       * and apply the scaling to the horizontal scale accordingly.
       */
      background.height = app.screen.height * 1.2;
      background.scale.x = background.scale.y;
    }

    // Position the background sprite in the center of the stage.
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    background.zIndex = -10;

    // Add the background to the stage.
    app.stage.addChild(background);
  }

  // Michi
  async function createMichi() {
    const michi = new Sprite(Assets.get("michi"));
    michi.label = "michi";
    michi.anchor.set(0.5);
    michi.scale.set(0.8);
    michi.y = app.screen.height - app.screen.height / 4;
    michi.x = app.screen.width - app.screen.width * 0.99;
    app.stage.addChild(michi);
    curr_michi = michi;
    await slideIn(michi, "left");
  }

  // Leben
  function createLives() {
    var generatorNum = 0;
    var heartPosition = 0;
    while (generatorNum < numberOfLifes) {
      const heart = new Sprite(Assets.get("herz"));
      heart.anchor.set(0.5);
      heart.scale.set(0.21);
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

  function slideInMultiple() {}

  async function slideOut(character) {
    const desti = app.screen.width + 1000;
    await slideIn(character, "left", 4, desti);
  }

  // generiert die Antwortmöglichkeiten
  function createText(text, h, slideInAnimation = true) {
    const y = app.screen.height - app.screen.height / 3 + h;

    const x = slideInAnimation
      ? app.screen.width - app.screen.width / 4
      : app.screen.width / 2;

    const text1 = createGenericText(text, x, y, slideInAnimation);
    return text1;
  }

  // erzeugt eine Sterbeanimation der Gegner
  async function deathAnimation(el) {
    const rotate = () => {
      el.rotation += 0.1; // radians per frame
    };
    /*
    await slideTo(
      curr_michi,
      app.screen.width - app.screen.width / 4,
      app.screen.height / 4,
      10
    );
    await slideTo(
      curr_michi,
      app.screen.width / 4,
      app.screen.width - app.screen.height / 4,
      10
    );
    */
    app.ticker.add(rotate);
    await slideTo(el, app.screen.width - 200, 0 - 200);
  }

  function slideTo(sprite, targetX, targetY, speed = 10) {
    return new Promise((resolve) => {
      app.ticker.add(function move() {
        const dx = targetX - sprite.x;
        const dy = targetY - sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
          sprite.x = targetX;
          sprite.y = targetY;
          app.ticker.remove(move);
          resolve();
          return;
        }

        // Normalize direction and move toward target
        sprite.x += (dx / dist) * speed;
        sprite.y += (dy / dist) * speed;
      });
    });
  }

  async function removeEveryItemFromScreen({ exceptList = [] }) {
    return new Promise((resolve) => {
      for (const child of app.stage.children.slice()) {
        var savecounter = false;
        for (const label_el of exceptList) {
          if (child.label === label_el) {
            savecounter = true;
          }
        }
        if (!savecounter) {
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
        await showText({
          text: "(Du hast die Frage richtig beantwortet)",
          height: 1.95,
        });
        resolve();
      });
    }
    // Alle Elemente außer "michi" aus der Stage entfernen
    return new Promise(async (resolve) => {
      if (curr_enemy != null) {
        await new Promise((resolve) => {
          app.stage.removeChild(curr_q);
          showText({ text: "Neeeiiin", height: 1.95 });
          deathAnimation(curr_enemy);
          setTimeout(() => {
            resolve();
          }, 1500);
        });
      }
      await new Promise((resolve) => {
        app.stage.removeChild(curr_sb);
        showText({
          text: "(Du hast die Frage richtig beantwortet)",
          steady: true,
          height: 1.95,
        });
        setTimeout(() => {
          resolve();
        }, 1500);
      });
      await removeEveryItemFromScreen({ exceptList: ["michi", "heart"] });
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
    sound.stopAll();
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
    await scaleUp(thanos, 4, 0.02);

    numberOfLifes = 3;
    return await new Promise(async (resolve) => {
      await new Promise(async (resolve) => {
        await showText({
          text: "Das war dein letzter\nUrlaubstag!",
          height: 2,
          color: "white",
          fontSize: 15,
        });
        showText({
          text: "(in Europa)",
          height: 2,
          color: "white",
          fontSize: 15,
        });
        setTimeout(() => {
          resolve();
        }, 2000);
      });
      removeEveryItemFromScreen({});
      await showText({ text: "Auf ein Neues!\nDiesmal klappts bestimmt!" });
      await createMichi();

      app.stage.interactiveChildren = true;
      restartGame();
    });
  }

  async function looseFunction(an1, an2, an3, resolve) {
    app.stage.removeChild(curr_q);
    app.stage.interactiveChildren = false;
    await showText({
      text: "HAHAHAHA",
      height: 1.95,
    });
    await showText({
      text: "DAS WAR DIE FALSCHE ANTWORT",
      height: 1.95,
    });
    await showText({
      text: "Das kostet dich einen\ndeiner Urlaubstage!",
      height: 1.95,
    });
    await showText({
      text: "(in Europa)",
      height: 1.95,
    });
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
    await showText({
      text: "Zurück zur Frage:",
      height: 1.95,
    });

    app.stage.addChild(curr_q);
    app.stage.interactiveChildren = true;
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
    const heights = [
      { h: 150, prefix: "C" },
      { h: 75, prefix: "B" },
      { h: 0, prefix: "A" },
    ];
    // Array zufällig mischen (Fisher–Yates)
    for (let i = heights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [heights[i], heights[j]] = [heights[j], heights[i]];
    }
    const text10 = createText(
      `${heights[0].prefix}: ${answerCorrect}`,
      heights[0].h
    );
    const text20 = createText(
      `${heights[1].prefix}: ${answerWrong1}`,
      heights[1].h
    );
    const text30 = createText(
      `${heights[2].prefix}: ${answerWrong2}`,
      heights[2].h
    );
    curr_o1 = text10;
    curr_o2 = text20;
    curr_o3 = text30;
    await waitForAnswer(text10, text20, text30, stay_in_arena);
  }

  function showText({
    text,
    steady = false,
    height = 3,
    color = "black",
    time_frame = 1500,
    font = "Pixelletters",
    fontSize = 10,
  }) {
    return new Promise((resolve) => {
      const text1 = new Text({
        text,
        style: {
          fontFamily: font,
          fontSize: fontSize,
          fill: color,
          resolution: 2,
        },
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
        }, time_frame); //1500
      }
    });
  }

  const dialogue1 = [
    "Grrr, Na Gut",
    "Diesmal bist du\nnoch davon gekommen.",
    "Aber denk ja nicht\ndass es schon vorbei ist",
  ];
  const dialogue2 = [
    "Du schummelst doch!",
    "So leicht lasse\nich dich nicht...",
    "...gewinnen",
  ];
  const dialogue3 = ["Einen hab ich noch!\nEinen hab ich noch!"];

  const dialoguePool = [dialogue1, dialogue2];

  async function executeFight({
    enemy_str,
    title,
    question_map_list,
    introwords = [],
    enemy_position = 4,
    enemy_scale = 0.1,
    arena = "arena1",
    enemy_Height = 4,
  }) {
    // Gegnergenerierung
    const enemy = new Sprite(Assets.get(enemy_str));
    enemy.anchor.set(0.5);
    enemy.scale.set(enemy_scale * 4);
    enemy.y = app.screen.height / enemy_Height;
    enemy.x = app.screen.width + 60;
    app.stage.addChild(enemy);
    curr_enemy = enemy;

    // Sprechblase
    const sp_b = new Sprite(Assets.get("bubble"));
    sp_b.anchor.set(0.5);
    sp_b.scale.set(0.115);
    sp_b.y = app.screen.height / 2;
    sp_b.x = app.screen.width + 200;
    app.stage.addChild(sp_b);
    curr_sb = sp_b;

    addBackground(arena);

    await slideIn(enemy, "right", enemy_position);
    await wait(200);
    await showText({
      text: `Herausforderung ${cur_challenge}:\n${title}`,
      height: 2,
      time_frame: 2000,
      font: "GloriousFree",
      fontSize: 20,
    });
    var counter = 1;
    var stay_in_arena = true;
    await slideIn(sp_b, "right", 2);
    for (const el of question_map_list) {
      console.log(el);
      for (const el2 of introwords) {
        await showText({ text: el2, height: 1.95 });
      }
      curr_q = createGenericText(
        el.question,
        app.screen.width / 2,
        app.screen.height / 1.95,
        false
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
      if (stay_in_arena) {
        await slideIn(sp_b, "right", 2);
        const randomDialogue =
          dialoguePool[Math.floor(Math.random() * dialoguePool.length)];
        await generateTextSequence(randomDialogue, 1.95, 10);
      }
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
  const introText1 = [
    "Lieber Michi!",
    "Herzlichen Glückwunsch\nzur gelungenen Hochzeit!",
    "Das war wirklich ein\ntoller Abend.",
    "Auf deinem bisherigen\nWeg durchs Leben ...",
    "... hast du schon viele\nPrüfungen gemeistert.",
    "Heute musst du dich noch\neinmal...",
    "... vier deiner erbittersten\nGegener stellen.",
    "Am Ende wartet\nein Preis auf dich",
    "Zu Beginn des Spiels",
  ];

  const introText2 = [
    "erhältst du drei\nUrlaubstage",
    "(in Europa)",
    "Immer wenn du\neinen Fehler machst",
    "kriegst du\neinen Urlaubstag...",
    "(in Europa)",
    "...abgezogen.",
    "Wenn du keine Urlaubstage",
    "(in Europa)",
    "mehr hast...",
    "...musst du wieder\nvon vorne anfangen",
    text5,
  ];

  async function generateTextSequence(listOfTexts, h = 3, size = 15) {
    for (const el of listOfTexts) {
      await showText({ text: el, height: h, fontSize: size });
    }
  }
  await wait(500);
  /*
  await createMichi();
  // Begrüsung

  await generateTextSequence(introText1);
  createLives();
  await generateTextSequence(introText2);
*/
  async function sendMail({ paypa_yes }) {
    // mail code here
    console.log(michael_data.sicherheits_antwort);
    app.stage.interactiveChildren = false;
    const connection_text = createGenericText(
      "Verbinde mit Server...",
      app.screen.width / 4,
      app.screen.height / 12,
      false
    );
    await new Promise(async (resolve) => {
      try {
        const res = await fetch(
          "https://michis-hochzeit-backend-840610411426.asia-southeast2.run.app/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answer: michael_data["sicherheits_antwort"],
              player: michael_data["michis_name"],
              paypal_acc: michael_data["michis_mail"],
              website: "",
              no_paypal: paypa_yes,
            }),
          }
        );

        const res_text = await res.text();
        let res_data = {};
        try {
          res_data = JSON.parse(res_text);
        } catch {
          res_data = {};
        }
        console.log({ status: res.status, ok: !!res_data.ok, raw: res_text });
        if (res_data.ok) {
          resolve();
        } else {
          app.stage.interactiveChildren = true;
          const error_mes = new Sprite(Assets.get("error_mes"));
          error_mes.anchor.set(0.5);
          error_mes.scale.set(0.8);
          error_mes.y = app.screen.height / 2;
          error_mes.x = app.screen.width / 2;
          error_mes.eventMode = "static";
          app.stage.addChild(error_mes);

          error_mes.on("pointerdown", () => {
            app.stage.removeChild(error_mes);
            app.stage.removeChild(connection_text);
          });
        }
      } catch (error) {
        app.stage.interactiveChildren = true;
        const error_mes2 = new Sprite(Assets.get("error_mes2"));
        error_mes2.anchor.set(0.5);
        error_mes2.scale.set(0.2);
        error_mes2.y = app.screen.height / 2;
        error_mes2.x = app.screen.width / 2;
        error_mes2.eventMode = "static";
        app.stage.addChild(error_mes2);

        error_mes2.on("pointerdown", () => {
          app.stage.removeChild(error_mes2);
          app.stage.removeChild(connection_text);
        });
      }
    });

    removeEveryItemFromScreen({});
    const goodbySequence = [
      "Danke für die 3000 Euro!",
      "Spaß!",
      "Deine Anfrage wurde\nerfolgreich versendet",
      "Dein Gewinn wird dir in\nKürze auf Paypal zugesendet.",
      "Ich hoffe du hattest Spaß\nmit meinem kleinen Quiz.",
    ];
    generateTextSequence(goodbySequence);
  }
  /*
  async function restartGame() {
    updateLives();
    // Bereit Button
    const bereit = new Sprite(Assets.get("bereit"));
    bereit.anchor.set(0.5);
    bereit.scale.set(0.07);
    bereit.y = app.screen.height - app.screen.height / 4;
    bereit.x = app.screen.width + 60;
    app.stage.addChild(bereit);
    bereit.eventMode = "static";
    await showText({ text: text5 });
    await slideIn(bereit, "right");
    await new Promise((resolve) => {
      bereit.on("pointerdown", () => {
        resolve();
      });
    });
    app.stage.removeChild(bereit);

    sound.play("background", { loop: true, volume: 0.2 });

    cur_challenge = 1;
    await executeFight({
      enemy_str: "geiger",
      title: "Geigenunterricht",
      introwords: ["Hehehehehehe", "hehehe", "hehe", "he"],
      question_map_list: [geigenfrage1],
      enemy_scale: 0.16,
    });
    await executeFight({
      enemy_str: "deutscher",
      title: "Deutsch lernen",
      introwords: ["GRRAAAHHH!!!"],
      question_map_list: [deutschfrage1, deutschfrage2],
      enemy_position: 3,
      enemy_scale: 0.12,
      arena: "arena2",
    });

    sound.stop("background");
    sound.play("background2", { loop: true, volume: 0.2 });
    await executeFight({
      enemy_str: "bachelor",
      title: "Wiwi-Bachelor",
      question_map_list: [bachelorfrage1, bachelorfrage2],
      arena: "arena3",
      enemy_position: 3,
      enemy_Height: 3,
      enemy_scale: 0.12,
    });
    sound.stop("background2");
    sound.play("background4");

    const markusTexts = [
      "Hey, pssst Michael",
      "Hallo hier oben!",
      "Klasse wie gut du vorankommst!",
      "Zur Feier des Tages",
      "spendiere ich dir einen...",
      "... Extra Urlaubstag!",
    ];

    const markusTexts2 = [
      "(in Europa)",
      "Viel Erfolg weiterhin",
      "Ach ja",
      "Schau gern mal wieder",
      "im akademischen Orchester vorbei",
      "",
      "BITTE KOMM ZURÜCK",
    ];

    const sp_b = new Sprite(Assets.get("bubble"));
    sp_b.anchor.set(0.5);
    sp_b.scale.set(0.115);
    sp_b.y = app.screen.height / 2;
    sp_b.x = app.screen.width + 160;
    app.stage.addChild(sp_b);
    curr_sb = sp_b;

    const markus = new Sprite(Assets.get("markus"));
    markus.anchor.set(0.5);
    markus.scale.set(1);
    markus.y = app.screen.height / 4;
    markus.x = app.screen.width + 160;
    app.stage.addChild(markus);
    curr_sb = markus;

    await slideIn(markus, "right", app.screen.width / 4);

    await slideIn(sp_b, "right", 2, app.screen.width / 2);

    await generateTextSequence(markusTexts, 1.95, 10);
    numberOfLifes++;
    updateLives();
    await generateTextSequence(markusTexts2, 1.95, 10);

    await slideOut(sp_b);
    await slideOut(markus);

    sound.stop("background4");

    sound.play("background3", { loop: true, volume: 0.8 });
    await executeFight({
      enemy_str: "fabrik",
      title: "Fabrikleitung",
      question_map_list: [fabrikfrage2, fabrikfrage1, fabrikfrage3],
      enemy_position: 3,
      enemy_scale: 0.25,
      enemy_Height: 3,
    });

    sound.stop("background3");
  }

  await restartGame();

  sound.play("background5", { loop: true, volume: 0.5 });

  // addBackground("arena4");
  const outrTexts = [
    "Herzlichen Glückwunsch",
    "Du hast alle\nHerausforderungen\nmit Bravur gemeistert!",
    "Hier deine Belohnung",
  ];
  await generateTextSequence(outrTexts);

  await showText({ text: "(Bitte anklicken)", steady: true });

  const schatz = new Sprite(Assets.get("schatz"));
  schatz.anchor.set(0.5);
  schatz.scale.set(0.8);
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
*/
  Assets.unload([
    { alias: "soundtrack", src: "assets/soundtrack.mp3" },
    { alias: "magneto", src: "assets/magneto.mp3" },
    { alias: "romeo", src: "assets/romeo.mp3" },
    { alias: "adagio", src: "assets/adagio.mp3" },
    { alias: "victory", src: "assets/victory.mp3" },
    { alias: "michi", src: "assets/michi.png" },
    //  { alias: "font", src: "fonts/ArcadeClassic.ttf" },
    { alias: "font", src: "fonts/Pixelletters.ttf" },
    { alias: "font", src: "fonts/GloriousFree.ttf" },
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
    { alias: "markus", src: "assets/markus_rotated.png" },
    { alias: "arena3", src: "assets/arena3.png" },
    { alias: "arena2", src: "assets/arena2.png" },
    { alias: "arena1", src: "assets/arena1.png" },
  ]);
  function createInputField(flag, val) {
    const inp = new Sprite(Assets.get("input"));
    inp.scale.set(0.3);
    inp.anchor.set(0.1, 0);
    var inputF = new Input({
      bg: inp,
      padding: [0, 0, 0, 0],
      placeholder: flag,
      textStyle: { fontSize: 15 },
      addMask: false,

      // alternatively you can use [11, 11, 11, 11] or [11, 11] or just 11
    });
    inputF.x = app.screen.width / 5;
    const apply = (text) => {
      michael_data[val] = text;
      // möglichst wenig Arbeit hier drin
      // console.log knapp halten:
      console.log("name:", michael_data[val]);
    };

    // ✅ Signal gibt dir den aktuellen Text
    inputF.onChange.connect((text) => apply(text));

    return inputF;
  }

  showText({ text: "version A.3", steady: true, height: 5 });

  const input1 = createInputField("Name deines Nutzeraccounts", "michis_name");

  document.getElementById("fname").addEventListener("input", (t) => {
    michael_data["sicherheits_antwort"] = t.target.value;
  });

  const input2 = createInputField(
    "E-Mail deines Nutzeraccounts",
    "michis_mail"
  );

  const line3 = createGenericText(
    "Sicherheitsfrage:\nWie hieß dein letzer\nMitbewohner in Würzburg\nmit Vornamen?",
    app.screen.width / 2
  );

  const paypal = new Sprite(Assets.get("paypal"));
  paypal.anchor.set(0.5);
  paypal.scale.set(0.2);
  paypal.eventMode = "static";

  paypal.x = app.screen.width / 2;
  paypal.on("pointerdown", () => {
    sendMail({
      paypa_yes: "True",
    });
  });

  const shock = new Sprite(Assets.get("shock"));
  shock.anchor.set(0.5);
  shock.scale.set(0.18);
  shock.eventMode = "static";
  shock.x = app.screen.width / 2;

  function createForm(listOfSprites) {
    const area = app.screen.height - 200;
    const padding = area / listOfSprites.length;
    var h = 0;
    for (const el of listOfSprites) {
      //el.x = app.screen.width / 2;
      el.y = app.screen.height - app.screen.height + 100 + h * padding;
      h++;
      app.stage.addChild(el);
    }
  }

  const listOfSprits = [input1, input2, line3, paypal, shock];
  createForm(listOfSprits);
  shock.on("pointerdown", () => {
    sendMail({
      paypa_yes: "False",
    });
  });
})();
