import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const token = process.env["TOKEN"];
const rest = new REST().setToken(token);

let commands = [
  new SlashCommandBuilder()
    .setName("temperature")
    .setDescription("Convert different temperature formats")
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription("Source temperature format")
        .setRequired(true)
        .addChoices(
          { name: "°C", value: "c" },
          { name: "°F", value: "f" },
          { name: "K", value: "k" },
          { name: "°R", value: "r" },
          { name: "°Ré", value: "é" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("Target temperature format")
        .setRequired(true)
        .addChoices(
          { name: "°C", value: "c" },
          { name: "°F", value: "f" },
          { name: "K", value: "k" },
          { name: "°R", value: "r" },
          { name: "°Ré", value: "é" },
        ),
    )
    .addNumberOption((option) =>
      option
        .setName("value")
        .setDescription("The temperature value")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("public")
        .setDescription(
          "Should the response be visible to everyone? (Default: False)",
        )
        .setRequired(false),
    ),
];

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    for (let i = 0; i < commands.length; i++) {
      commands[i] = commands[i].toJSON();
      commands[i].integration_types = [
        0, // Guild Install
        1, // User Install
      ];
      commands[i].contexts = [
        0, // Guild
        1, // Bot DM
        2, // Private Channel
      ];
    }
    const userData = await rest.get(Routes.user());
    const userId = userData.id;
    const data = await rest.put(Routes.applicationCommands(userId), {
      body: commands,
    });
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
})();
