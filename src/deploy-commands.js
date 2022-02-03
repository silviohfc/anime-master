const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config");

const routePath =
  process.env.NODE_ENV === "dev"
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

const commands = [];
const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(routePath, { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
