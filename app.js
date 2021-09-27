const yargs = require("yargs");
const fs = require("fs");
const chalk = require("chalk");
const { exit, listenerCount } = require("process");

if (!fs.existsSync("./notes.json")) {
  fs.writeFileSync("notes.json", "[]");
}

yargs
  .command({
    command: "add",

    describe: "Add a note",

    builder: {
      title: {
        describe: "Title of the note to add",
        alias: "t",
        demandOption: true,
        type: "string",
      },
      body: {
        describe: "Contents of the note to add",
        demandOption: true,
        type: "string",
      },
    },

    handler: function () {
      let fullNote = {
        title: yargs.argv.title,
        body: yargs.argv.body,
      };

      fs.readFile("notes.json", function (err, content) {
        if (err) throw err;
        let newArrayJSON = JSON.parse(content);

        for (i = 0; i < newArrayJSON.length; i++) {
          if (newArrayJSON[i].title === fullNote.title) {
            console.log(chalk.black.bgRed("Title already taken!"));
            return;
          }
        }
        newArrayJSON.push(fullNote);

        fs.writeFileSync(
          "notes.json",
          JSON.stringify(newArrayJSON),
          "utf8",
          function (err) {
            if (err) throw err;
          }
        );
        console.log(chalk.black.bgGreen("New Note created!"));
      });
    },
  })
  .command({
    command: "remove",
    describe: "remove a note",

    builder: {
      title: {
        describe: "Title of the note to remove",
        alias: "t",
        demandOption: true,
        type: "string",
      },
    },

    handler: function () {
      let fullNote = {
        title: yargs.argv.title,
      };

      fs.readFile("notes.json", function (err, content) {
        if (err) throw err;
        let newArrayJSON = JSON.parse(content);
        for (i = 0; i < newArrayJSON.length; i++) {
          if (newArrayJSON[i].title === fullNote.title) {
            newArrayJSON.splice(i, 1);
            console.log(chalk.black.bgGreen("Note removed!"));
            fs.writeFileSync(
              "notes.json",
              JSON.stringify(newArrayJSON),
              "utf8",
              function (err) {
                if (err) throw err;
              }
            );
            return;
          }
        }
        console.log(chalk.black.bgRed("Note not found!"));
      });
    },
  })
  .command({
    command: "list",
    describe: "list the note",

    handler: function () {
      fs.readFile("notes.json", function (err, content) {
        if (err) throw err;
        let newArrayJSON = JSON.parse(content);
        console.log(chalk.black.bgBlue("Your Notes:"));
        for (i = 0; i < newArrayJSON.length; i++) {
          console.log(newArrayJSON[i].title);
        }
      });
    },
  })
  .command({
    command: "read",
    describe: "list the content of the selected note-title",

    builder: {
      title: {
        describe: "Title of the note to show",
        alias: "t",
        demandOption: true,
        type: "string",
      },
    },

    handler: function () {
      let fullNote = {
        title: yargs.argv.title,
      };

      fs.readFile("notes.json", function (err, content) {
        if (err) throw err;
        let newArrayJSON = JSON.parse(content);
        for (i = 0; i < newArrayJSON.length; i++) {
          if (newArrayJSON[i].title === fullNote.title) {
            console.log(chalk.black.bgYellow("List"));
            console.log(newArrayJSON[i].body);
            return;
          }
        }
        console.log(chalk.black.bgRed("Note not found!"));
      });
    },
  })
  .help()
  .alias("help", "h");

yargs.parse();
