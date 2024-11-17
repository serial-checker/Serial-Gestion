const Discord = require('discord.js');
const db = require('quick.db');
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu
} = require('discord-buttons');

module.exports = {
    name: 'derank',
    aliases: [],

    run: async (client, message, args, prefix, color) => {
        let perm = "";
        // Vérifier les permissions de l'utilisateur
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = null;
        });

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

            // Si un ID ou une mention est fournie
            if (args[0]) {
                let user = await message.guild.members.fetch(args[0]) || message.mentions.members.first();
                if (!user) return;

                // Effectuer l'action de derank (retirer tous les rôles sauf @everyone)
                try {
                    // Retirer tous les rôles sauf @everyone
                    await user.roles.set([], `Derank par ${message.author.tag}`);
                    
                    // Message indiquant que l'utilisateur a été deranké
                    message.channel.send(`${user} a été **derank**.`);

                    // Envoyer un message de log si un canal est configuré pour les logs
                    let wass = db.get(`logmod_${message.guild.id}`);
                    const logschannel = message.guild.channels.cache.get(wass);

                    if (logschannel) {
                        logschannel.send(new Discord.MessageEmbed()
                            .setColor(color)
                            .setDescription(`${message.author} a **derank** ${user.user}`)
                        );
                    }
                } catch (err) {
                    return message.channel.send('Une erreur est survenue lors du **derank** de ce membre.');
                }
            } else {
                return message.channel.send('Veuillez spécifier un utilisateur à **derank**.');
            }

        }
    }
};
