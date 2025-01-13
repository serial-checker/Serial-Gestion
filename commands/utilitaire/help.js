const Discord = require('discord.js')
const db = require('quick.db')
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');
const {
	ButtonPages
} = require('../../util/embedButton/start.js');

module.exports = {
	name: 'help',
	aliases: ['aide','tuto'],
	run: async (client, message, args, prefix, color) => {
		if (args[0] === "all") {

			const public = new Discord.MessageEmbed()
				.setColor(color)
				.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
				.setTitle("Liste des commandes par permissions")
				.setTimestamp()
				.setDescription(`

**__Public__**
- \`${client.config.prefix}banner [membre]\`
- \`${client.config.prefix}invite [membre]\`
- \`${client.config.prefix}support\`
- \`${client.config.prefix}pic [membre]\`
- \`${client.config.prefix}porngif\` (*Salon nsfw*)
- \`${client.config.prefix}snipe\`
- \`${client.config.prefix}ping\`
- \`${client.config.prefix}serverinfo [guild]\`
- \`${client.config.prefix}userinfo [user]\`
- \`${client.config.prefix}top [rank]\`
- \`${client.config.prefix}help\`
- \`${client.config.prefix}channelinfo [sallon]\`
- \`${client.config.prefix}prevname [membre]\`
- \`${client.config.prefix}rank [membre]\`
`)

			let perm = ""
			message.member.roles.cache.forEach(role => {
				if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true
				if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
				if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
			})
			if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

				const mods = new Discord.MessageEmbed()
					.setColor(color)
					.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
					.setTitle("Liste des commandes par permissions")
					.setTimestamp()
					.setDescription(`*Les commandes **Public** sont aussi disponible pour la permissions **Mods***
                
**__Perm Mods__**
- \`${client.config.prefix}voice [info all/all]\`
- \`${client.config.prefix}help all\`
- \`${client.config.prefix}unmute <membre>\`
- \`${client.config.prefix}booster\`
- \`${client.config.prefix}warn <add/remove/list/clear> <add/remove: membre> <remove: warnID>\`
- \`${client.config.prefix}mute <membre> [temps/raison]\`
- \`${client.config.prefix}unmute <membre>\`
- \`${client.config.prefix}mutelist\`
`)

				const admin = new Discord.MessageEmbed()
					.setColor(color)
					.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
					.setTitle("Liste des commandes par permissions")
					.setTimestamp()
					.setDescription(`*Les commandes disponible pour les permissions **Mods** sont aussi disponible pour la permissions **Admin***
                
**__Perm Admin__**
- \`${client.config.prefix}alladmin\`
- \`${client.config.prefix}allbot\`
- \`${client.config.prefix}allbotadmin\`
- \`${client.config.prefix}roleinfo <rôle>\`
- \`${client.config.prefix}bringall\`
- \`${client.config.prefix}slowmode <salon> <durée>\`
- \`${client.config.prefix}unban <membre>\`
- \`${client.config.prefix}kick <membre> [raison]\`
- \`${client.config.prefix}ban <membre> [raison]\`
- \`${client.config.prefix}banlist\`
`)

				const owner = new Discord.MessageEmbed()
					.setColor(color)
					.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
					.setTitle("Liste des commandes par permissions")
					.setTimestamp()
					.setDescription(`*Les commandes disponible pour les permissions **Admin** sont aussi disponible pour la permissions **Owner***
                
** __Perm Owner__**
- \`${client.config.prefix}unlock [salon]\`
- \`${client.config.prefix}renew [salon]\`
- \`${client.config.prefix}lock [salon]\`
- \`${client.config.prefix}clear [message]\`
`)

				const owner2 = new Discord.MessageEmbed()
					.setColor(color)
					.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
					.setTitle("Liste des commandes par permissions")
					.setTimestamp()
					.setDescription(`*Les commandes disponible pour **toute les permissions** sont aussi disponible pour les personnes étant **owner du bot***
                
**__Owner Bot__**
- \`${client.config.prefix}addrole <membre> <rôle>\`
- \`${client.config.prefix}delrole <membre> <rôle>\` 
- \`${client.config.prefix}derank <membre>\`
- \`${client.config.prefix}lock all\`
- \`${client.config.prefix}muterole [rôle]\`
- \`${client.config.prefix}renew all\`
- \`${client.config.prefix}unban all\`
- \`${client.config.prefix}unlock all\`
- \`${client.config.prefix}unmute all\`
- \`${client.config.prefix}counter\`
- \`${client.config.prefix}embed\`
- \`${client.config.prefix}rolemembers <rôle>\`
- \`${client.config.prefix}emoji <add/remove> <emoji>\`
- \`${client.config.prefix}giveaway <role>\`
- \`${client.config.prefix}giveaway reroll\`
- \`${client.config.prefix}leave\`
- \`${client.config.prefix}levels\`
- \`${client.config.prefix}logs\`
- \`${client.config.prefix}massrole <add/remove> <rôle>\`
- \`${client.config.prefix}perm\`
- \`${client.config.prefix}public <add/clear/list/remove> <add/remove: salon>\`
- \`${client.config.prefix}rolemenu\`
- \`${client.config.prefix}say <message>\`
- \`${client.config.prefix}soutien\`
- \`${client.config.prefix}tempvoc\`
- \`${client.config.prefix}welcome\`
- \`${client.config.prefix}mybot\`
`)
					.setFooter(`Prefix : ${prefix} • ${client.config.name}`)

				const embedPages = [public, mods, admin, owner, owner2];
				ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			}


		} else if (!args[0]) {



			let perm = ""
			message.member.roles.cache.forEach(role => {
				if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = 1
				if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = 2
				if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = 3
			})
			if (db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) perm = 4
			if (client.config.owner.includes(message.author.id)) perm = 5

			const util = new Discord.MessageEmbed()
			util.setColor(color)
			util.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
			util.setTitle("Utilitaire")
			util.setTimestamp()
			util.setDescription("*Les paramètres entre **`<...>`** sont obligatoire, alors que les paramètres entre **`[...]`** eux sont facultatifs*")
                if (1 <= perm) util.addField(`\`${prefix}voice [info all/all]\``, "Permet de voir des informations sur les les membres en vocal sur le serveur")
                if (1 <= perm) util.addField(`\`${prefix}help all\``, "Permet de voir les commandes du bot via les permissions")
                if (1 <= perm) util.addField(`\`${prefix}booster\``, "Permet de voir tout les membres ayant booster le serveur")
				if (2 <= perm) util.addField(`\`${prefix}alladmin\``, "Permet de voir tout les administrateurs présents sur le serveur")
				if (2 <= perm) util.addField(`\`${prefix}allbot\``, "Permet de voir tout les bots présents sur le serveur")
				if (2 <= perm) util.addField(`\`${prefix}allbotadmin\``, "Permet de voir tout les bots administrateurs présents sur le serveur")
                if (2 <= perm) util.addField(`\`${prefix}roleinfo <rôle>\``, "Permet de d'avoir des informations sur un rôle")
            	if (2 <= perm) util.addField(`\`${prefix}slowmode <salon> <durée>\``, "Change la durée du mode lent sur un salon max 6h")
			util.addField(`\`${prefix}banner [membre]\``, "Permet de voir la bannière d'un utilisateur")
			util.addField(`\`${prefix}calc\``, "Permet d'éffectuer un calcul avec le bot")
            util.addField(`\`${prefix}prevname [membre]\``, "Permet de voir tout les anciens pseudo d'un utilisateur")
			util.addField(`\`${prefix}rank [membre]\``, "Permet de voir le rank d'un membre")
			util.addField(`\`${prefix}channelinfo [salon]\``, "Permet de d'avoir des informations sur un salon")
			util.addField(`\`${prefix}help\``, "Permet de voir la liste des commandes du bot")
			util.addField(`\`${prefix}invite [membre]\``, "Permet de voir le nombre d'invtations que possède un utilisateur")
			util.addField(`\`${prefix}pic [membre]\``, "Permet de voir la photo de profil d'un utilisateur")
			util.addField(`\`${prefix}pornigf\``, "Permet de voir des images nsfw")
			util.addField(`\`${prefix}ping\``, "Permet de voir la latence du bot et du websocket en ms")
			util.addField(`\`${prefix}serverinfo [guild]\``, "Permet de d'avoir des informations sur un serveur où ce trouve le bot")
			util.addField(`\`${prefix}snipe\``, "Permet de voir le dernier message supprimés")
			util.addField(`\`${prefix}top [rank] [invite]\``, "Permet de voir un classement des ranks, ou des invitations")
			util.addField(`\`${prefix}userinfo [membre]\``, "Permet de d'avoir des informations sur un utilisateur")
			util.addField(`\`${prefix}support\``, "Donne une invitation pour le serveur de support bot")


			const mods = new Discord.MessageEmbed()
			mods.setColor(color)
			mods.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
			mods.setTitle("Modération")
			mods.setTimestamp()
			mods.setDescription("*Les paramètres entre **`<...>`** sont obligatoire, alors que les paramètres entre **`[...]`** eux sont facultatifs*")
            if (1 <= perm) mods.addField(`\`${prefix}warn <add/remove/list/clear> <add/remove: membre> <remove: warnID>\``, "Permet de gérer les sanctions d'un membre")
            if (1 <= perm) mods.addField(`\`${prefix}mute <membre> [temps/raison]\``, "Permet de rendre muet un membre sur le serveur")
            if (1 <= perm) mods.addField(`\`${prefix}mutelist\``, "Permet de voir les membres muet en direct")
            if (1 <= perm) mods.addField(`\`${prefix}unmute <membre>\``, "Permet de demute un membre du serveur")
            if (2 <= perm) mods.addField(`\`${prefix}unban <membre>\``, "Permet de debannir un membre du serveur")
            if (2 <= perm) mods.addField(`\`${prefix}kick <membre> [raison]\``, "Permet d'expulser un membre du serveur")
            if (2 <= perm) mods.addField(`\`${prefix}ban <membre> [raison]\``, "Permet de bannir un membre du serveur")
            if (2 <= perm) mods.addField(`\`${prefix}banlist\``, "Permet de voir tout les membres bannis sur le serveur")
            if (3 <= perm) mods.addField(`\`${prefix}unlock [salon]\``, "Permet d'ouvir un salon du serveur pour le rôle @everyone")
            if (3 <= perm) mods.addField(`\`${prefix}renew [salon]\``, "Permet de recrée un salon du serveur")
            if (3 <= perm) mods.addField(`\`${prefix}lock [salon]\``, "Permet de fermé un salon du serveur pour le rôle @everyone")
            if (3 <= perm) mods.addField(`\`${prefix}clear [message]\``, "Permet de supprimés des messages dans un salon")
			if (4 <= perm) mods.addField(`\`${prefix}addrole <membre> <rôle>\` *(Seulement les rôles sans permissions dangereuse)*`, "Permet de donner un rôle à un membre sur le serveur")
			if (4 <= perm) mods.addField(`\`${prefix}delrole <membre> <rôle>\` *(Seulement les rôles sans permissions dangereuse)*`, "Permet de retirer un rôle à un membre sur le serveur")
			if (4 <= perm) mods.addField(`\`${prefix}derank <membre>\``, "Permet d'enlever tout les rôles d'un membre")
			if (4 <= perm) mods.addField(`\`${prefix}lock all\``, "Permet de fermé tout les salons du serveur pour le rôle @everyone")
			if (4 <= perm) mods.addField(`\`${prefix}muterole [rôle]\``, "Permet de définir un rôle muet ou d'en crée un")
			if (4 <= perm) mods.addField(`\`${prefix}renew all\``, "Permet de recrée tout les salons du serveur")
			if (4 <= perm) mods.addField(`\`${prefix}unban all\``, "Permet de debannir tout les membres du serveur")
			if (4 <= perm) mods.addField(`\`${prefix}unlock all\``, "Permet de réouvir tout les salons du serveur pour le rôle @everyone")
			if (4 <= perm) mods.addField(`\`${prefix}unmute all\``, "Permet de demute tout les membres muet sur le serveur")


			const gestion = new Discord.MessageEmbed()
			gestion.setColor(color)
			gestion.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
			gestion.setTitle("Serveur Gestion")
			gestion.setTimestamp()
			gestion.setDescription("*Les paramètres entre **`<...>`** sont obligatoire, alors que les paramètres entre **`[...]`** eux sont facultatifs*")
			if (4 <= perm) gestion.addField(`\`${prefix}counter\``, "Permet de gérer les compteurs personnalisés sur le serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}embed\``, "Permet de crée un embed totalement personalisable")
			if (4 <= perm) gestion.addField(`\`${prefix}bringall\``, "Permet de déplacer tout les membres dans un salon vocal précis")
			if (4 <= perm) gestion.addField(`\`${prefix}rolemembers <rôle>\``, "Permet de voir les membres ayant le rôle mentioné")
			if (4 <= perm) gestion.addField(`\`${prefix}emoji <add/remove> <emoji>\``, "Permet d'ajouté ou d'enlevé un emoji du serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}giveaway\``, "Permet de crée un giveaway")
			if (4 <= perm) gestion.addField(`\`${prefix}giveaway reroll\``, "Permet de changer le gagnant d'un giveaway")
			if (4 <= perm) gestion.addField(`\`${prefix}leave\``, "Permet de paramétrer les actions à effectuer quand un membre quitte le serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}levels\``, "Permet de paramétrer les actions à effectuer quand un membre gagne un niveau sur le serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}logs\``, "Permet de définir les salons de logs")
			if (4 <= perm) gestion.addField(`\`${prefix}massrole <add/remove> <rôle>\``, "Permet d'ajouté ou d'enlevé un rôle à tout les membres du serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}perm\``, "Affiche la liste des rôles ayant des permissions sur le bot")
			if (4 <= perm) gestion.addField(`\`${prefix}public <add/clear/list/remove> <add/remove: salon>\``, "Permet de gérer les salons où les commandes public sont autorisés")
			if (4 <= perm) gestion.addField(`\`${prefix}rolemenu\``, "Affiche un menu interactif pour créer ou modifier un reactionrole/boutonrole ")
			if (4 <= perm) gestion.addField(`\`${prefix}say <message>\``, "Permet d'envoyer un message avec le bot")
			if (4 <= perm) gestion.addField(`\`${prefix}soutien\``, "Permet de donner automatiquement un rôle aux membres ayant un message dans leurs statuts ")
			if (4 <= perm) gestion.addField(`\`${prefix}tempvoc\``, "Affiche un menu interactif pour gérer les vocaux temporaires sur le serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}welcome\``, "Permet de paramétrer les actions à effectuer quand un membre rejoint le serveur")
			if (4 <= perm) gestion.addField(`\`${prefix}theme <color>\``, "Permet de changer la couleur d'embed du bot")
            if (5 <= perm) gestion.addField(`\`${prefix}antiraid\``, "Permet de gérer les modules d'antiraid sur le serveur")
            if (5 <= perm) gestion.addField(`\`${prefix}raidlog <on/off/> [salon]\``, "Permet de définir le salon de raidlog")
            if (5 <= perm) gestion.addField(`\`${prefix}prefix <prefix>\``, "Permet de changer le prefix du bot")

			const bot = new Discord.MessageEmbed()
			bot.setColor(color)
			bot.setFooter(`Prefix : ${prefix} • ${client.config.name}`)
			bot.setTitle("Bot")
			bot.setTimestamp()
			bot.setDescription("*Les paramètres entre **`<...>`** sont obligatoire, alors que les paramètres entre **`[...]`** eux sont facultatifs*")
			if (4 <= perm) bot.addField(`\`${prefix}blacklist <add/clear/list/remove> <add/remove: membre>\``, "Permet de gérer les utilisateurs blacklist")
			if (4 <= perm) bot.addField(`\`${prefix}blacklistrank <add/clear/list/remove> <add/remove: membre>\``, "Permet de gérer les utilisateurs blacklistrank")
            if (4 <= perm) bot.addField(`\`${prefix}whitelist <add/clear/list/remove> <add/remove: membre>\``, "Permet de gérer les utilisateurs whitelist")
			if (5 <= perm) bot.addField(`\`${prefix}owner <add/clear/list/remove> <add/remove: membre>\``, "Permet de gérer les utilisateurs owners")
			if (5 <= perm) bot.addField(`\`${prefix}server <invite/leave/list> <leave/invite: ID>\``, "Permet de gérer les serveurs où ce trouve le bot")
			if (5 <= perm) bot.addField(`\`${prefix}botconfig\``, "Permet de gérer la configuration du bot")
			if (5 <= perm) bot.addField(`\`${prefix}botinfo\``, "Permet de voir les informations détaillé du bot")
            if (5 <= perm) bot.addField(`\`${prefix}mybot\``, "Permet de voir tout les bots du client")
            if (5 <= perm) bot.addField(`\`${prefix}backup <emoji> <clear/create/list/load/remove> <2/3/4: code>\``, "Permet de gérer les backup d'émoji sur le bot")

			if (perm === "" && db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true) return message.channel.send(util)
			if (perm === 1) {
				const embedPages = [util, mods];
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			} else if (perm === 2 || perm === 3) {
				const embedPages = [util, mods];
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			} else if (perm === 4) {
				const embedPages = [util, mods, gestion, bot];
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			} else if (perm === 5) {
				const embedPages = [util, mods, gestion, bot];
				return ButtonPages(client.interaction, message, embedPages, 60 * 1000, "gray", "▶", "◀");
			}
		}
	}
}
