const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'dmall',
    aliases: ['dmallrole'],

    run: async (client, message, args, prefix, color) => {
        let perm = false;
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) {
                perm = true;
                return;
            }
        });

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
            if (!args[0]) return message.channel.send("Veuillez spécifier un message à envoyer.");

            let targetRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
            let content = targetRole ? args.slice(1).join(" ") : args.join(" ");
            let members = targetRole ? targetRole.members : message.guild.members.cache;

            if (!content) return message.channel.send("Veuillez spécifier un message à envoyer.");
            if (members.size === 0) return message.channel.send("Aucun membre trouvé pour cet envoi de message.");

            let success = 0, failed = 0;

            await Promise.all(members.map(async member => {
                if (!member.user.bot) {
                    try {
                        await member.send(content);
                        success++;
                    } catch (err) {
                        failed++;
                    }
                }
            }));

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle("DM All")
                .setDescription(`Le message a été envoyé à **${success}** membres.\nÉchecs : **${failed}** membres.`);
            message.channel.send(embed);

            // Envoi du log
            let logsChannelId = db.get(`logmod_${message.guild.id}`);
            const logsmod = message.guild.channels.cache.get(logsChannelId);

            if (logsmod) {
                const logEmbed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${message.author} a effectué un **dmall** sur ${targetRole ? targetRole : "tout le serveur"} *(ce dmall a touché ${success} membres)*`);
                logsmod.send(logEmbed);
            }
        }
    }
};
