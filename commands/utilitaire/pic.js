const Discord = require('discord.js');
const db = require('quick.db');
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu
} = require('discord-buttons');

module.exports = {
    name: 'pic',
    aliases: ['pp', 'avatar'],
    run: async (client, message, args, prefix, color) => {
        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true) {
            let user;

            // Vérifier si un utilisateur est mentionné, ou si un ID d'utilisateur est fourni
            if (message.mentions.users.size > 0) {
                user = message.mentions.users.first();
            } else if (args[0]) {
                // Tenter de récupérer un utilisateur avec l'ID
                try {
                    user = await client.users.fetch(args[0]);
                } catch (error) {
                    return message.channel.send('Utilisateur introuvable.');
                }
            } else {
                // Si aucune mention ni ID n'est fourni, on utilise l'auteur du message
                user = message.author;
            }

            const Embed = new Discord.MessageEmbed()
                .setTitle(`${user.username}`)
                .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setColor(color);

            message.channel.send(Embed);
        }
    }
};
