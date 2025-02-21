const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
    name: "changelogs",
    run: async (client, message) => {
        const color = db.get(`color_${message.guild.id}`) || client.config.color;

        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if (!(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true)) {
            return message.channel.send;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle("📢 Changements récents")
            .setDescription("[Voir le projet sur GitHub](https://github.com/serial-checker/Serial-Gestion)\n\n✨ **Dernières améliorations et ajouts sur le bot :**")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addField("🆕 **Ajouts récents :**", 
                "• ✨ **`prevname`** : *Affiche l'historique des pseudos d'un utilisateur.*\n" +
                "• 🎭 **`rolemembers`** : *Liste les membres d'un rôle mentionné.*\n" +
                "• 🚀 **`boosters`** : *Montre les membres ayant boosté le serveur.*\n" +
                "• 🧮 **`calc`** : *Permet d'effectuer un calcul mathématique.*\n" +
                "• 📊 **`rank`** : *Affiche le rang d'un membre.*\n" +
                "• 🐌 **`cfx`** : *Permet de voir l'état des serveurs CFX.re*\n" +
                "• 🎧 **`bringall`** : *Déplace tous les membres vers un salon vocal.*\n" +
                "• 🔧 **`delrole`** : *Retire un rôle à un membre.*\n" +
                "• 👄 **`fakesay`** : *La commande envoie un message en se faisant passer pour un membre*\n" +
                "• 🕰️ **`slowmode`** : *Active le mode lent dans un salon (max 6h).*\n" +
                "• 🚀 **`dmall`** : *Permet d'envoyer un message en fonction du rôle choisis à tout les membres le possédant*\n" +
                "• 🤖 **`mybot`** : *Affiche tous les bots perso que vous possedez*\n\u200B")
            .addField("🔧 **Rework :**", 
                "• 🎯 **`top rank`** & **`top invite`** : *Amélioration des classements.*\n" +
                "• 🎨 **`help`** & **`help all`** : *Rework esthétique.*\n" +
                "• 🔑 **Permissions :** *Amélioration de la gestion des accès sur toutes les commandes.*\n\u200B")
            .addField("📊 **Logs ajoutées :**", 
                "• 🛡️ **`roleUpdate`** : *Suivi des modifications de rôles.*\n" +
                "• 🔄 **`VoiceChannelSwitch`** : *Détection des changements de salon vocal.*\n" +
                "• 🎙️ **`voiceMuteLogs`** : *Logs des actions de mute/démute.*\n" +
                "• 🎧 **`voiceStateUpdate`** : *Suivi des changements d'état vocal.*")
            .setFooter("🕰️ Dernière mise à jour :")
            .setTimestamp();

        message.channel.send(embed);
    }
};
