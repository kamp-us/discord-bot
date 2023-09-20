export default function (plop) {
  plop.setGenerator("create-command", {
    description: "Creates a new command for Kampus Bot",
    prompts: [
      {
        type: "input",
        name: "command-name",
        message: "What is the name of the command?",
      },
      {
        type: "input",
        name: "command-description",
        message: "What is the description of the command?",
      },
      {
        type: "input",
        name: "command-arguments",
        message: "What are the arguments of the command?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/commands/{{command-name}}.ts",
        templateFile: "generators/command.hbs",
      },
    ],
  });
}
