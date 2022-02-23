const Discord = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["kick"],
    category: "Moderators",
    description: "кикнуть пользователя",
    usage: "kick <@пользователь> [причина]",
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

        let banreason = ``;
		if (!reasonBan) {
			reasonBan = 'Не указано';
			banreason = `${message.author.tag}: Не указано`;
		} else {
			banreason = `${message.author.tag}: ${reasonBan}`;
		}

        embed.setDescription(`**Кикнуть самого себя нельзя**`)
        if(banUser == message.author.id) return message.channel.send(embed)

        const embedchannel_mod = new Discord.MessageEmbed()
        embedchannel_mod.setTitle(`${bot.user.username} | Кик`)
        embedchannel_mod.setColor("RED")
        embedchannel_mod.setDescription(`Пользователю <@${banUser.user.id}> (${banUser.user.username}#${banUser.user.discriminator}) был кикнут с сервера.\n> ${reasonBan || "Не указано"}`)
        embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())
        
        await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);

        var bandm = new Discord.MessageEmbed()
        .setTitle(`${bot.user.username} | Кик`)
        .setColor("RED")
        .addField(`**Информация о вашем кике:**`, `**Кикнул: \`${message.author.tag}\`\nПричина: \`${reasonBan}\`**`)
        .setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setTimestamp();
        await banUser.send(bandm).catch(() => {});

        await message.guild.member(banUser).kick(banreason);
    }
}