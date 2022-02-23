const Discord = require("discord.js");

module.exports = {
    name: "разбан",
    aliases: ["unban"],
    category: "Moderators",
    description: "разблокировать пользователя",
    usage: "разбан [id пользователя] [причина]",
    run: async (bot, message, args, cmd) => {
        await message.delete()
        
        var unbanUser = args[0];
        
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${bot.user.username} | Ошибка`)
        embed.setColor('RED')
        embed.setDescription(`**Недостаточно прав для использования данной команды**`)
        embed.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        
        if(!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send(embed)
        
        embed.setDescription(`**Укажите пользователя**`)
        if(!unbanUser) return message.channel.send(embed);
        
        var reasonUnBan = args.slice(1).join(" ");

        let banreason = ``;
		if (!reasonUnBan) {
			reasonUnBan = 'Не указано';
			banreason = `${message.author.tag}: Не указано`;
		} else {
			banreason = `${message.author.tag}: ${reasonUnBan}`;
		}

        embed.setDescription(`**Разблокировать самого себя нельзя**`)
        if(unbanUser == message.author.id) return message.channel.send(embed)

        message.guild.fetchBans().then(async(bans) => {
            let userban = await bans.get(unbanUser);

            embed.setDescription(`**Блокировка у пользователя не найдена**`)
            if(!userban) return message.channel.send(embed)

            const embedchannel_mod = new Discord.MessageEmbed()
            embedchannel_mod.setTitle(`${bot.user.username} | Разблокировка аккаунта`)
            embedchannel_mod.setColor("green")
            embedchannel_mod.setDescription(`Пользователю <@${userban.user.id}> (${userban.user.username}#${userban.user.discriminator}) была выдана разблокировка аккаунта.\n> ${reasonUnBan || "Не указано"}`)
            embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())
            
            await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);
            await message.guild.members.unban(unbanUser, `${banreason}`)
        })
    }
}