const axios = require('axios');
const db = require("quick.db");
const Discord = require("discord.js");
const ms = require("ms");

module.exports = (client, message) => {

    let guild = message.guild;
    const color = db.get(`color_${guild.id}`) === null ? client.config.color : db.get(`color_${guild.id}`);
    let wass = db.get(`msglog_${message.guild.id}`);
    const logschannel = message.guild.channels.cache.get(wass);

    // Si un canal de log est défini
    if (logschannel) {
        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`**Message envoyé** dans <#${message.channel.id}> par ${message.author.tag} (${message.author.id})`)
            .addField('Contenu', message.content || 'Aucun contenu (message vide)', false)
            .addField('ID du message', message.id, true)
            .addField('Date d\'envoi', message.createdAt.toLocaleString(), true)
            .setTimestamp(); // Ajoute un timestamp pour l'envoi du message

        // Si le message a des pièces jointes
        if (message.attachments.size > 0) {
            const files = message.attachments.map(attachment => attachment.url).join('\n');
            embed.addField('Pièces jointes', files);
        }

        // Si le message a des mentions d'utilisateurs
        if (message.mentions.users.size > 0) {
            const mentions = message.mentions.users.map(user => user.tag).join(', ');
            embed.addField('Mentions', mentions);
        }

        // Si le message a des mentions de rôles
        if (message.mentions.roles.size > 0) {
            const roleMentions = message.mentions.roles.map(role => role.name).join(', ');
            embed.addField('Mentions de rôles', roleMentions);
        }

        // Si le message a des réactions
        if (message.reactions.cache.size > 0) {
            const reactions = message.reactions.cache.map(reaction => `${reaction.emoji.name} (${reaction.count} réactions)`).join('\n');
            embed.addField('Réactions', reactions);
        }

        // Gestion des embeds dans le message
        if (message.embeds.length > 0) {
            // Pour chaque embed attaché au message, récupérer les informations de base
            message.embeds.forEach(embedMsg => {
                embed.addField('Embed', `Description : \n${embedMsg.description || 'Aucune description'}\n` +
                    `Couleur : ${embedMsg.color ? `#${embedMsg.color.toString(16)}` : 'Aucune'}\n` +
                    `URL : ${embedMsg.url || 'Aucune URL'}`);
            });
        }

        // Envoi de l'embed dans le canal de logs
        logschannel.send(embed);
    }
};
