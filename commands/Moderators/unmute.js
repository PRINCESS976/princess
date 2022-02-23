const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "unmute",
    aliases: ["unmute"],
    category: "Moderators",
    description: "размутить пользователя",
    usage: "unmute <@пользователь> [причина]",
    run: async (bot, message, args, cmd) => {
        await message.delete()
        
        var muteUser = message.guild.member(message.mentions.users.first() || message.guild.member(args[0]));
        
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${bot.user.username} | Ошибка`)
        embed.setColor('RED')
        embed.setDescription(`**Недостаточно прав для использования данной команды**`)
        embed.setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        
        if(!message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send(embed)

        embed.setDescription(`**Укажите пользователя**`)
        if(!muteUser) return message.channel.send(embed);
        
        embed.setDescription(`**У пользователя нет активного мута**`)
        if(!muteUser.roles.cache.get("842329552676323340")) return message.channel.send(embed);

        const embedchannel_mod = new Discord.MessageEmbed()
        embedchannel_mod.setTitle(`${bot.user.username} | Размут аккаунта`)
        embedchannel_mod.setColor("RED")
        embedchannel_mod.setDescription(`Пользователю <@${muteUser.user.id}> (${muteUser.user.username}#${muteUser.user.discriminator}) был снят временный мут.`)
        embedchannel_mod.setFooter(`Инициатор: ${message.author.tag}`, message.author.avatarURL())
        
        await bot.channels.cache.get("859726857058385940").send(embedchannel_mod);

        var bandm = new Discord.MessageEmbed()
        .setTitle(`${bot.user.username} | Размут аккаунта`)
        .setColor("RED")
        .addField(`**Информация:**`, `**Размутил: \`${message.author.tag}\`**`)
        .setFooter(`${bot.user.tag} | Made by Desert Cave Development`, bot.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        .setTimestamp();
        await muteUser.send(bandm).catch(() => {});

        await Mutes.deleteOne({ userID: muteUser.id });
        if(muteUser.roles.cache.get("842329552676323340")){
            await muteUser.roles.remove("842329552676323340");
        }
    }
}