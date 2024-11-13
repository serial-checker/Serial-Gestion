const axios = require('axios');
const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = async (client, member, channel, message) => {
    
    const color = db.get(`color_${member.guild.id}`) === null ? client.config.color : db.get(`color_${member.guild.id}`);
    let wass = db.get(`logvc_${member.guild.id}`);
    const logschannel = member.guild.channels.cache.get(wass);

    if (logschannel) {
        // Création de l'embed pour les logs détaillés
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member} se **connecte au salon** <#${channel.id}>`)
            .addField('Nom du salon vocal', channel.name, true)
            .addField('ID du salon vocal', channel.id, true)
            .addField('Nombre d\'utilisateurs dans le salon', channel.members.size, true)
            .addField('Salon privé', channel.type === 'voice' && channel.permissionsFor(member.guild.roles.everyone).has('VIEW_CHANNEL') ? 'Public' : 'Privé', true)
            .addField('Statut du membre', `${member.presence ? member.presence.status : 'Non défini'}`, true)
            .addField('Membre ID', member.id, true)
            .addField('Roles du membre', member.roles.cache.map(role => role.name).join(', ') || 'Aucun', true)
            .addField('Heure de connexion', new Date().toLocaleString(), true)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true })) // Ajoute l'avatar du membre en miniature
            .setFooter(`${client.config.name ? client.config.name : 'Bot'} | Log de salon vocal`)
            .setTimestamp();

        // Envoi de l'embed dans le canal de logs
        logschannel.send(embed);
    }
};
