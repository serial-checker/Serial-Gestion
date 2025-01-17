const db = require("quick.db");

module.exports = {
    name: "vanity",
    run: async (client, message) => {
        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if (!(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true || db.get(`channelpublic_${message.channel.id}`) === true)) {
            return;
        }

        // Récupération de l'URL Vanity (lien personnalisé)
        try {
            const vanityData = await message.guild.fetchVanityData();
            const vanityURL = `https://discord.gg/${vanityData.code}`;
            message.channel.send(vanityURL);
        } catch (error) {
            message.channel.send("❌ Ce serveur n'a pas d'URL personnalisée ou une erreur s'est produite.");
        }
    }
};
