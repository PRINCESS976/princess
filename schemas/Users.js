const schema = mongoose.Schema({
    userID: String,
    warns: { type: Number, default: 0 }
});

module.exports = mongoose.model(`Users`, schema)