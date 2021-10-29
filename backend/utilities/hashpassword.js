const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    // const hashedPassword = await new Promise((resolve, reject) => {
    //     bcrypt.hash(password, saltRounds, function(err, hash) {
    //       if (err) reject(err)
    //       resolve(hash)
    //     });
    //   })
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}

function compareHashPassword(password, passwordHash) {
    bcrypt.compare(password, passwordHash, function(err, result) {
        // result == true
        return result;  // true/false
    });
}

module.exports = {
    hashPassword,
    compareHashPassword
}