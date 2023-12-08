const cron = require('node-cron');
const User = require('../models/sql/user');
const { send } = require('../util/mailer');

async function askForPasswordRenew() {
  // expires 60 days after creation
  const expirationTime = 60 * 24 * 60 * 60 * 1000; // 60 days
  const currentTimestamp = Date.now();

  try {
    // récupération des utilisateurs dont le compte createdAt est supérieur à 60 jours
    const usersHaveToRenew = await User.findAll({
      where: {
        createdAt: { $lt: currentTimestamp - expirationTime },
      },
    });

    // envoi d'un email préventif à chaque utilisateur
    for (const user of usersHaveToRenew) {
      send('./assets/template/template-renew-password.ejs'),
        { firstname: user.firstname, link: process.env.FRONT_URL },
        user.email,
        'Renouvellement de votre mot de passe';
    }
  } catch (error) {
    console.error(error);
  }
}

// toutes les 24h
cron.schedule('0 0 * * *', askForPasswordRenew);

module.exports = askForPasswordRenew;
