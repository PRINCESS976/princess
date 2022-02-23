const Discord = require("discord.js");

module.exports = {
    name: "unwarn",
    aliases: ["unwarn"],
    category: "Moderators",
    description: "снять предупреждение пользователю",
    usage: "unwarn <@пользователь> [причина]",
    run: async (bot, message, args, cmd) => {
        await message.delete()
        
        var banUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
        
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${bot.user.username} | Ошибка`)
        embed.setColor('RED')
        embed.setDescription(`**Недостаточно прав для использования данной команды**`)
        embed.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        
        if(!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send(embed)
        
        embed.setDescription(`**Укажите пользователя**`)
        if(!banUser) return message.channel.send(embed);
        
        var reasonBan = args.slice(1).join(" ");

		if (!reasonBan) {
			reasonBan = 'Не указано';
		}

        embed.setDescription(`**Снять варн самому себе нельзя**`)
        if(banUser == message.author.id) return message.channel.send(embed)

        let userDB = await Users.findOne({ userID: banUser.id });
        if(!userDB){
            await Users.create({ userID: banUser.id, warns: 0 });
        }
        
        if(userDB.warns >= 1){
            userDB.warns -= 1;
            await userDB.save().catch(err => console.log(err));
        } else {
            embed.setDescription(`**У пользователя нет варнов**`)
            return message.channel.send(embed)
        }

        const embedchannel_mod = new Discord.MessageEmbed()
        embedchannel_mod.setTitle(`${bot.user.username} | Снятие предупреждения аккаунта`)
        embedchannel_mod.setColor("green")
        embedchannel_mod.setDescription(`Пользователю <@${banUser.user.id}> (${banUser.user.username}#${banUser.user.discriminator}) было снято предупреждение **${userDB.warns || 0}/6**.\n> ${reasonBan || "Не указано"}`)
        embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())

        const bandm = new Discord.MessageEmbed()
        bandm.setTitle(`${bot.user.username} | Снятие предупреждения аккаунта`)
        bandm.setColor("green")
        bandm.addField(`**Информация о вашем предупреждении:**`, `**Снял: \`${message.author.tag}\`\n\nОбщее количество \`${userDB.warns || 0}/6\`\nПричина: \`${reasonBan}\`**`)
        bandm.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        bandm.setTimestamp();

        await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);
        await banUser.send(bandm).catch(() => {});
    }
}