const mongoose = require('mongoose');

main().then(() => console.log("Connection Mongo Good")).catch(err => console.log(err, "ERORROR"));

async function main() {
    await mongoose.connect('mongodb://root:cs2@mongodb:27017/admin');
}

