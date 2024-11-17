const axios = require('axios');
const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = (client, member, voiceChannel) => {

    const color = db.get(`color_${member.guild.id}`) === null ? client.config.color : db.get(`color_${member.guild.id}`);
    let wass = db.get(`logvc_${voiceChannel.guild.id}`);
    const logschannel = voiceChannel.guild.channels.cache.get(wass);

    // Si un canal de log est défini
    if (logschannel) {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member} **partage son écran** dans <#${voiceChannel.id}>`)
            .addField('ID du salon', voiceChannel.id, true)
            .addField('Nom du salon', voiceChannel.name, true)
            .addField('Statut', `${member.presence ? member.presence.status : 'Non défini'}`, true)
            .addField('Heure du partage', new Date().toLocaleString(), true)
            .setFooter(`${client.config.name ? client.config.name : 'Bot'} | Log de stream`)
            .setTimestamp();

        // Envoi de l'embed dans le canal de logs
        logschannel.send(embed);
    }
};
