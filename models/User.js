const mongoose = require('mongoose')






// https://codeburst.io/build-simple-medium-com-on-node-js-and-react-js-a278c5192f47
let UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        join_date: { type: Date, default: Date.now },
        address: String,
        provider_pic: String,
        labels: [String],
        groups: [String],
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('User', UserSchema)