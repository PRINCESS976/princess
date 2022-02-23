const schema = mongoose.Schema({
    userID: String,
    timemute: String,
    curtime: String,
});

module.exports = mongoose.model(`Mutes`, schema)