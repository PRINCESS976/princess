const discord = require("discord.js");
const fs = require("fs");
const bot = new discord.Client();
global.botconfig = require('./config.js');
global.mongoose = require('mongoose');
global.mongooseDynamic = require ('mongoose-dynamic-schemas');

// СХЕМЫ БАЗЫ ДАННЫХ
global.Users = require("./schemas/Users");
global.Mutes = require('./schemas/Mutes');

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();
cooldowns = new discord.Collection();

bot.categories = fs.readdirSync("./commands/");

["command", "events"].forEach(handler => {require(`./Handler/${handler}`)(bot);});

mongoose.connect(botconfig.mongo, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('[DATABASE] Подключение успешно прошло!')
})

bot.on("message", async message => {
  var prefix = botconfig.prefix;//Устанавливаем префикс комманд боту
  if (message.author.bot) return;//Если автор другой бот - нет.
  if (message.channel.type == "dm") return;//Если команда в личку - нет.

  let userDB = await Users.findOne({ userID: message.author.id });
  if(!userDB) await Users.create({ userID: message.author.id });

  if (!message.content.startsWith(prefix)) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = bot.commands.get(cmd);
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));
  if (command) command.run(bot, message, args);
});

bot.login(botconfig.token)