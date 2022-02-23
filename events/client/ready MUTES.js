module.exports = async (bot, botor, con) => {
    const Discord = require(`discord.js`);
    setInterval(async function() {
      await Mutes.find({}).exec(async(err, res) => {
        if(err) throw err;
        if(res.length == 0) return;
        await res.forEach(async(mute) => {
          let timeout = mute.timemute;
          let curtime = mute.curtime;
          let user = bot.guilds.cache.get("842312043133534248").members.cache.get(mute.userID);
          if (curtime !== null && timeout - (Date.now() - curtime) > 0) return;
          await Mutes.deleteOne({
            userID: user.id
          }).catch(err => console.log(err));
          if(user.roles.cache.get("842329552676323340")){
            await user.roles.remove(bot.guilds.cache.get("842312043133534248").roles.cache.get("842329552676323340"));
          }
        })
      })
    }, 1000)
  };