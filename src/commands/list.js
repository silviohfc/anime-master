const { SlashCommandBuilder } = require("@discordjs/builders");
const Animes = require("../models/anime");

const sortFunctions = {
  aazz: (list) =>
    list.sort((a, b) => {
      if (a.dataValues.name > b.dataValues.name) return 1;
      if (a.dataValues.name < b.dataValues.name) return -1;
      return 0;
    }),
  zzaa: (list) =>
    list.sort((a, b) => {
      if (a.dataValues.name < b.dataValues.name) return 1;
      if (a.dataValues.name > b.dataValues.name) return -1;
      return 0;
    }),
};

const statusEmojis = {
  "completed": ":white_check_mark:",
  "watching": ":eyes:",
  "plan to watch": ":notepad_spiral:",
};

const generateStatus = (status) => {
  const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
  return `${statusCapitalized} ${statusEmojis[status]}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Show full anime list")
    .addStringOption((option) =>
      option
        .setName("sort")
        .setDescription("Sort the anime list")
        .setRequired(false)
        .addChoice("Aa-Zz", "aazz")
        .addChoice("Zz-Aa", "zzaa"),
    )
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("Filter the anime list")
        .setRequired(false)
        .addChoice("Completed", "completed")
        .addChoice("Watching", "watching")
        .addChoice("Plan to Watch", "plan to watch"),
    ),

  async execute(interaction) {
    try {
      const animeList = await Animes.findAll();
      const sortChoice = interaction.options.getString("sort");
      const filterChoice = interaction.options.getString("filter");

      let sortedAnimeList = animeList;

      if (sortChoice) {
        sortedAnimeList = sortFunctions[sortChoice](animeList);
      }

      if (filterChoice) {
        sortedAnimeList = sortedAnimeList.filter(
          (anime) => anime.dataValues.status === filterChoice,
        );
      }

      const animeListString = sortedAnimeList
        .map((anime) => {
          return `[${anime.dataValues.id}] ${anime.dataValues.name} - ${generateStatus(anime.dataValues.status)}`;
        })
        .join("\n");

      return interaction.reply(animeListString);
    } catch (error) {
      return interaction.reply("Something went wrong with showing anime list.");
    }
  },
};
