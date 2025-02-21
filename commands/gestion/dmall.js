const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'dmall',
    aliases: ['dmtorole'],
    run: async (client, message, args) => {
        if (!(client.config.owner.includes(message.author.id) || Boolean(db.get(`ownermd_${client.user.id}_${message.author.id}`)))) {
            return message.channel.send("❌ Vous n'avez pas la permission d'utiliser cette commande.");
        }

        // Vérification du rôle (mention ou ID)
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.channel.send("❌ Rôle introuvable. Mentionnez un rôle ou utilisez un ID valide.");

        // Vérification du message à envoyer
        let content = args.slice(1).join(" ");
        if (!content) return message.channel.send("❌ Veuillez fournir un message à envoyer.");

        // Vérification du mode "silent"
        let silent = content.endsWith("--silent");
        if (silent) content = content.replace("--silent", "").trim();

        // Chargement de tous les membres pour éviter les erreurs
        await message.guild.members.fetch();
        let members = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && !member.user.bot);
        if (members.size === 0) return message.channel.send("❌ Aucun membre humain trouvé avec ce rôle.");

        // Si plus de 50 membres, demander confirmation
        if (members.size > 50) {
            let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('confirm').setLabel('✅ Confirmer').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('cancel').setLabel('❌ Annuler').setStyle(ButtonStyle.Danger)
            );

            let confirmMsg = await message.channel.send({
                content: `⚠ **Attention !** Tu es sur le point d'envoyer un DM à **${members.size}** membres. Confirmer ?`,
                components: [row]
            });

            const collector = confirmMsg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm') {
                    await i.update({ content: "📨 Envoi des messages en cours...", components: [] });
                    sendDMs();
                } else {
                    await i.update({ content: "❌ Envoi annulé.", components: [] });
                }
                collector.stop();
            });

            return;
        }

        // Envoi des messages
        sendDMs();

        async function sendDMs() {
            let sentCount = 0;
            let failed = [];

            await Promise.all(Array.from(members.values()).map(async member => {
                try {
                    await member.send(content);
                    sentCount++;
                } catch (err) {
                    failed.push(member.user.tag);
                }
            }));

            let resultMessage = `✅ Message envoyé à **${sentCount}** membres.\n❌ **${failed.length}** échecs (DM fermés).`;
            if (!silent) message.channel.send(resultMessage);

            if (failed.length > 0) {
                let pages = [];
                for (let i = 0; i < failed.length; i += 10) {
                    pages.push(failed.slice(i, i + 10).join("\n"));
                }

                let page = 0;
                let embed = new EmbedBuilder()
                    .setTitle("❌ Membres n'ayant pas reçu le message")
                    .setDescription(pages[page] || "Aucune erreur")
                    .setFooter({ text: `Page ${page + 1}/${pages.length}` })
                    .setColor("Red");

                if (pages.length > 1) {
                    let row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
                        new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Secondary).setDisabled(page === pages.length - 1)
                    );

                    let msg = await message.channel.send({ embeds: [embed], components: [row] });

                    const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 60000 });

                    collector.on('collect', async i => {
                        if (i.customId === 'prev' && page > 0) page--;
                        if (i.customId === 'next' && page < pages.length - 1) page++;

                        embed.setDescription(pages[page]).setFooter({ text: `Page ${page + 1}/${pages.length}` });
                        row.components[0].setDisabled(page === 0);
                        row.components[1].setDisabled(page === pages.length - 1);

                        await i.update({ embeds: [embed], components: [row] });
                    });
                } else {
                    message.channel.send({ embeds: [embed] });
                }
            }
        }
    }
};
