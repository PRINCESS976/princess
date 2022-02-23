const Discord = require("discord.js");

module.exports = {
    name: "warn",
    aliases: ["warn"],
    category: "Moderators",
    description: "выдать предупреждение пользователю",
    usage: "warn <@пользователь> [причина]",
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

        embed.setDescription(`**Заварнить самого себя нельзя**`)
        if(banUser == message.author.id) return message.channel.send(embed)

        let userDB = await Users.findOne({ userID: banUser.id });
        if(!userDB) await Users.create({ userID: banUser.id, warns: 0 });
        
        let newwarn = userDB.warns + 1;
        const embedchannel_mod = new Discord.MessageEmbed()
        const bandm = new Discord.MessageEmbed()
        if(newwarn >= 6){
            let reasonBan = "Максимальное количество предупреждений: 6/6"
            
            embedchannel_mod.setTitle(`${bot.user.username} | Блокировка аккаунта`)
            embedchannel_mod.setColor("RED")
            embedchannel_mod.setDescription(`Пользователю <@${banUser.user.id}> (${banUser.user.username}#${banUser.user.discriminator}) была выдана постоянная блокировка аккаунта.\n> ${reasonBan || "Не указано"}`)
            embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())

            bandm.setTitle(`${bot.user.username} | Блокировка аккаунта`)
            bandm.setColor("RED")
            bandm.addField(`**Информация о вашем бане:**`, `**Заблокировал: \`${message.author.tag}\`\nВремя: Навсегда\nПричина: \`${reasonBan}\`**`)
            bandm.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            bandm.setTimestamp();

            await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);
            await banUser.send(bandm).catch(() => {});

            userDB.warns = 0
            await userDB.save().catch(err => console.log(err));

            await message.guild.members.ban(banUser, {reason: reasonBan});
        } else {
            if(userDB){
                userDB.warns += 1;
                await userDB.save().catch(err => console.log(err));
            }

            embedchannel_mod.setTitle(`${bot.user.username} | Предупреждение аккаунта`)
            embedchannel_mod.setColor("RED")
            embedchannel_mod.setDescription(`Пользователю <@${banUser.user.id}> (${banUser.user.username}#${banUser.user.discriminator}) получил предупреждение **${userDB.warns || 1}/6**.\n> ${reasonBan || "Не указано"}`)
            embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())

            bandm.setTitle(`${bot.user.username} | Предупреждение аккаунта`)
            bandm.setColor("RED")
            bandm.addField(`**Информация о вашем предупреждении:**`, `**Предупредил: \`${message.author.tag}\`\n\nОбщее количество \`${userDB.warns || 1}/6\`\nПричина: \`${reasonBan}\`**`)
            bandm.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            bandm.setTimestamp();

            await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);
            await banUser.send(bandm).catch(() => {});
        }

    }
}