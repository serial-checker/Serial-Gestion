const { discord, MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { MessageActionRow, MessageButton } = require('discord-buttons');
const random_string = require("randomstring");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    name: 'warn',
    aliases: ["sanctions", "sanction", "warns"],
    run: async (client, message, args, prefix, color) => {

        let chx = db.get(`logmod_${message.guild.id}`);
        const logschannel = message.guild.channels.cache.get(chx);
        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
            if (args[0] === "add") {
                const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
                if (!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1]}\``);
                if (user.id === message.author.id) return message.channel.send(`Vous n'avez pas la permission de **warn** *(vous ne pouvez pas vous warn vous même)* <@${user.id}>`);
                if (user.roles.highest.position > message.member.roles.highest.position) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **warn** <@${user.id}>`);
                if (db.get(`ownermd_${message.author.id}`) === true) return message.channel.send(`Vous n'avez pas la permission de **warn** <@${user.id}>`);
                if (client.config.owner.includes(user.id)) return message.channel.send(`Vous n'avez pas la permission de **warn** *(vous ne pouvez pas warn un owner)* <@${user.id}>`);

                let reason = args.slice(2).join(" ");
                if (!reason) reason = "Aucune raison fournie.";

                let warnID = random_string.generate({
                    charset: 'numeric',
                    length: 8
                });

                db.push(`info.${message.guild.id}.${user.id}`, {
                    moderator: message.author.tag,
                    reason: reason,
                    date: Date.parse(new Date) / 1000,
                    id: warnID
                });
                db.add(`number.${message.guild.id}.${user.id}`, 1);

                await Promise.all([
                    message.channel.send(`${user} a été **warn** pour \`${reason}\``),
                    user.send(`Vous avez été **warn** sur ${message.guild.name} pour \`${reason}\``)
                ]);

                logschannel.send(new MessageEmbed()
                    .setColor(color)
                    .setDescription(`${message.author} a **warn** ${user} pour \`${reason}\``)
                );
            }

            if (args[0] === "list") {
                const user = message.mentions.users.first() || client.users.cache.get(args[1]) || message.author;
                if (!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1]}\``);

                const warnInfo = db.fetch(`info.${message.guild.id}.${user.id}`);
                const number = db.fetch(`number.${message.guild.id}.${user.id}`);

                if (!warnInfo || warnInfo.length === 0) return message.channel.send(`Aucun membre trouvé avec des sanctions pour \`${args[1] || "rien"}\``);

                let p0 = 0;
                let p1 = 5;
                let page = 1;

                const embed = new MessageEmbed()
                    .setTitle(`Liste des sanctions de ${user.username} • Total de sanctions : (**${number}**)`)
                    .setDescription(warnInfo.map((m, i) => `${i + 1}) ID Sanction: __${m.id}__ • Staff: __${m.moderator}__ • Raison: __${m.reason}__ • Date: <t:${m.date}>`).slice(p0, p1))
                    .setFooter(`${page}/${Math.ceil(number === 0 ? 1 : number / 5)} • ${client.config.name}`)
                    .setColor(color);

                message.channel.send(embed).then(async tdata => {
                    if (number > 5) {
                        const B1 = new MessageButton()
                            .setLabel("◀")
                            .setStyle("gray")
                            .setID('warnlist1');

                        const B2 = new MessageButton()
                            .setLabel("▶")
                            .setStyle("gray")
                            .setID('warnlist2');

                        const bts = new MessageActionRow()
                            .addComponent(B1)
                            .addComponent(B2);
                        tdata.edit("", { embed: embed, components: [bts] });

                        setTimeout(() => {
                            tdata.edit("", {
                                components: [],
                                embed: new MessageEmbed()
                                    .setTitle(`Liste des sanctions de ${user.username} • Total de sanctions : (**${number}**)`)
                                    .setDescription(warnInfo.map((m, i) => `${i + 1}) ID Sanction: __${m.id}__ • Staff: __${m.moderator}__ • Raison: __${m.reason}__ • Date: <t:${m.date}>`).slice(0, 5))
                                    .setFooter(`1/${Math.ceil(number === 0 ? 1 : number / 5)} • ${client.config.name}`)
                                    .setColor(color)
                            });
                        }, 60000 * 5);

                        client.on("clickButton", (button) => {
                            if (button.clicker.user.id !== message.author.id) return;

                            button.reply.defer(true);
                            if (button.id === "warnlist1") {
                                p0 -= 5;
                                p1 -= 5;
                                page--;

                                if (p0 >= 0) {
                                    updateWarnList(p0, p1, page);
                                }
                            } else if (button.id === "warnlist2") {
                                p0 += 5;
                                p1 += 5;
                                page++;

                                if (p1 <= number) {
                                    updateWarnList(p0, p1, page);
                                }
                            }
                        });

                        function updateWarnList(p0, p1, page) {
                            embed.setDescription(warnInfo.map((m, i) => `${i + 1}) ID Sanction: __${m.id}__ • Staff: __${m.moderator}__ • Raison: __${m.reason}__ • Date: <t:${m.date}>`).slice(p0, p1))
                                .setFooter(`${page}/${Math.ceil(number === 0 ? 1 : number / 5)} • ${client.config.name}`);
                            tdata.edit(embed);
                        }
                    }
                });
            }

            if (args[0] === "remove") {
                let id = args[2];
                const user = message.mentions.users.first() || client.users.cache.get(args[1]);
                if (!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1]}\``);
                if (user.id == message.author.id) return message.react("❌");

                let database = db.fetch(`info.${message.guild.id}.${user.id}`);
                if (!database || database.length === 0) return message.channel.send(`Aucun membre trouvé avec des sanctions pour \`${args[1] || "rien"}\``);

                if (!database.find(data => data.id === id)) return message.channel.send(`Aucune sanctions trouvé pour \`${args[2] || "rien"}\``);

                database.splice(database.findIndex(data => data.id == id), 1);
                if (database.length > 0) {
                    db.subtract(`number.${message.guild.id}.${user.id}`, 1);
                    db.set(`info.${message.guild.id}.${user.id}`, database);
                } else {
                    db.delete(`number.${message.guild.id}.${user.id}`);
                    db.delete(`info.${message.guild.id}.${user.id}`);
                }
                message.channel.send(`La sanctions **${args[2]}** a été supprimé`);
            }

            if (args[0] === "clear") {
                const user = message.mentions.users.first() || client.users.cache.get(args[1]);
                if (!user) return message.channel.send(`Aucun membre trouvé pour \`${args[1] || "rien"}\``);
                if (user.id == message.author.id) return message.react("❌");

                const number = db.fetch(`number.${message.guild.id}.${user.id}`);
                if (!number) return message.channel.send(`Aucune sanctions trouvé`);

                message.channel.send(`${number} ${number > 1 ? "sanctions ont été supprimés" : "sanction a été supprimé"}`);
                db.delete(`number.${message.guild.id}.${user.id}`);
                db.delete(`info.${message.guild.id}.${user.id}`);
            }
        }
    }
};
