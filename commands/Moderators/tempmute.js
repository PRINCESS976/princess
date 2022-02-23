const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "tempmute",
    aliases: ["tempmute"],
    category: "Moderators",
    description: "замутить пользователя",
    usage: "tempmute <@пользователь> [причина]",
    run: async (bot, message, args, cmd) => {
        await message.delete()
        
        var muteUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
        
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${bot.user.username} | Ошибка`)
        embed.setColor('RED')
        embed.setDescription(`**Недостаточно прав для использования данной команды**`)
        embed.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        
        if(!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send(embed)
        
        embed.setDescription(`**Заблокировать самого себя нельзя**`)
        if(muteUser == message.author.id) return message.channel.send(embed)

        embed.setDescription(`**Укажите пользователя**`)
        if(!muteUser) return message.channel.send(embed);
        
        embed.setDescription(`**У пользователя имеется активный мут**`)
        if(muteUser.roles.cache.get("842329552676323340")) return message.channel.send(embed);

        embed.setDescription(`**Укажите время блокировки**`)
        let time = args[1];
        if(!time) return message.channel.send(embed);

        var reasonBan = args.slice(2).join(" ");
        let banreason = ``;
		if (!reasonBan) {
			reasonBan = 'Не указано';
			banreason = `${message.author.tag}: Не указано`;
		} else {
			banreason = `${message.author.tag}: ${reasonBan}`;
		}

        let duration = ms(ms(time), { long: true })

        const embedchannel_mod = new Discord.MessageEmbed()
        embedchannel_mod.setTitle(`${bot.user.username} | Временный мут аккаунта`)
        embedchannel_mod.setColor("RED")
        embedchannel_mod.setDescription(`Пользователю <@${muteUser.user.id}> (${muteUser.user.username}#${muteUser.user.discriminator}) был выдан временный мут на **${duration}**.\n> ${reasonBan || "Не указано"}`)
        embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())
        
        await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);

        var bandm = new Discord.MessageEmbed()
        .setTitle(`${bot.user.username} | Временный мут аккаунта`)
        .setColor("RED")
        .addField(`**Информация о вашем муте:**`, `**Замутил: \`${message.author.tag}\`\nВремя: \`${duration}\`\nПричина: \`${reasonBan}\`**`)
        .setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setTimestamp();
        await muteUser.send(bandm).catch(() => {});

        await Mutes.create({
			userID: muteUser.id,
			timemute: ms(time),
			curtime: Date.now()
		}).catch(err => console.log(err));
        
        await muteUser.roles.add("842329552676323340");
    }
}