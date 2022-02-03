const { SlashCommandBuilder } = require("@discordjs/builders");
const Animes = require("../models/anime");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add an anime to list!")

    .addStringOption((option) =>
      option.setName("name").setDescription("The anime name").setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("The current anime status")
        .setRequired(true)
        .addChoice("Plan to Watch", "plan to watch")
        .addChoice("Watching", "watching")
        .addChoice("Completed", "completed")
    ),

  async execute(interaction) {
    const animeName = interaction.options.getString("name");
    const animeStatus = interaction.options.getString("status");

    try {
      const anime = await Animes.create({
        name: animeName,
        status: animeStatus,
      });
      console.log(anime);
      return interaction.reply(`Anime ${anime.dataValues.name} added.`);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.reply("That anime already exists.");
      }

      return interaction.reply("Something went wrong with adding an anime.");
    }
  },
};
