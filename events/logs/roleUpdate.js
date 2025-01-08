const db = require("quick.db");
const Discord = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
    const guild = oldMember.guild;
    let chx = db.get(`logmod_${guild.id}`);
    const logsmod = guild.channels.cache.get(chx);
    const color = db.get(`color_${guild.id}`) === null ? client.config.color : db.get(`color_${guild.id}`);

    //if (!logsmod) return console.log("Salon de logs introuvable."); 

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    // Détection des rôles ajoutés
    const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
    if (addedRoles.size > 0) {
        addedRoles.forEach(role => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${newMember.user.username}`, newMember.user.displayAvatarURL({ dynamic: true }))
                .setColor(color)
                .setDescription(`📥 **${newMember}** a ajouté le rôle ${role} à ${newMember.user.tag}`)
            logsmod.send(embed);
        });
    }

    // Détection des rôles retirés
    const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
    if (removedRoles.size > 0) {
        removedRoles.forEach(role => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${newMember.user.username}`, newMember.user.displayAvatarURL({ dynamic: true }))
                .setColor(color)
                .setDescription(`📤 **${newMember}** a retiré le rôle ${role} à ${newMember.user.tag}`)
            logsmod.send(embed);
        });
    }
};
