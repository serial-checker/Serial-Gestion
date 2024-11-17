const axios = require('axios');
const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = async (client, member, channel) => {

    const color = db.get(`color_${member.guild.id}`) === null ? client.config.color : db.get(`color_${member.guild.id}`);
    let wass = db.get(`logvc_${member.guild.id}`);
    const logschannel = member.guild.channels.cache.get(wass);
    
    // Si un canal de log est défini
    if (logschannel) {
        // Créer l'embed de déconnexion
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member} quitte **le salon** <#${channel.id}>`)
            .addField('ID du salon', channel.id, true)
            .addField('Nom du salon', channel.name, true)
            .addField('Statut', `${member.presence ? member.presence.status : 'Non défini'}`, true)
            .addField('Ancien salon', member.voice.channel ? `#${member.voice.channel.name} (ID: ${member.voice.channel.id})` : 'Aucun', true)
            .addField('Heure de déconnexion', new Date().toLocaleString(), true)
            .setFooter(`${client.config.name ? client.config.name : 'Bot'} | Log de salon vocal`)
            .setTimestamp();

        // Envoi de l'embed dans le canal de logs
        logschannel.send(embed);
    }
};
