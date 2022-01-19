module.exports.help = {
    name: "massban",
    description: "ban multiples members",
    aliases: ['multipleban'],
    permissions: ['ban_members'],
    private: false,
    dm: false,
    cooldown: 10
};

const Discord = require('discord.js');

/**
 * @param {Discord.Message} message 
 * @param {Array} args 
 */
module.exports.run = (message, args, client, prefix) => {
    if (args.length === 0) return message.channel.send({ embeds: [
        new Discord.MessageEmbed()
            .setTitle("Invalid args")
            .setColor('RED')
            .setTimestamp()
            .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setAuthor(message.guild.name, message.guild.icon ? message.guild.iconURL({dynamic: true}) : message.author.avatarURL({dynamic: true}))
            .setDescription(`You need to specify at least **2 members** and a reason\n\nExemple : \`${prefix}massban @user1 @user2 @user3 userid4 here is the reason\``)
    ] });

    const members = [];
    //create an array for all members seleceted
    

    if (message.mentions.members.size > 0) {
        message.mentions.members.forEach((member) => {
            members.push(member);
            //push the member into array
        });
    };

    for (let i = 0; i< args.length; i++) {
        let arg = args[i];
        let member = message.guild.members.cache.get(arg);
        if (member) {
            if (!members.find((x) => x.id === member.id)) {
                members.push(member);
            };
        };
    };

    go = true;
    members.forEach((member) => {
        if (!member.bannable) go = false;
        //Here we check if members are bannable
        if (member.roles.highest.position >= message.member.roles.highest.position == false) go = false;    
        //check the roles of members
        // >= is MORE or EQUAL
    });

    if (go == false) {
        return message.channel.send({ embeds: [
            new Discord.MessageEmbed()
                .setTitle(":x: inbannable member(s).")
                .setDescription(`One or some of ${members.length} members can't be banned.\nThere are two reason :\n**1)** I haven't permissions.\n**2)**Theses members are superior or equal to you in role hierarchy**`)
                .setTimestamp()
                .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setColor('RED')
        ] });
    };
    let reason = '';
    indexStop = 0;

    let i = 0;

    while (i < args.length) {
        let member = message.guild.members.cache.get(args[i]);
        if (!member) {
            indexStop = i;
            i = args.length + 1;
            //define reason here
        };
        i++;
    };

    const argsArray = args.slice(indexStop+1);
    reason = argsArray.join(' ');
    
    if (reason) return message.channel.send({ content: 'Please specify a reason' });
    let total = members.length;

    members.forEach((x) => {
        x.send({ embeds: [
            new Discord.MessageEmbed()
                .setTitle("Ban")
                .setDescription(`You are banned from ${message.guild.name} because \`\`\`${reason}\`\`\``)
                .setColor('RED')
                .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setTimestamp()
        ] }).catch(() => {});
        
        x.ban({reason: `${reason} (by ${message.author.tag}, ${message.author.id})`}).catch(() => {total--});
        //Ban members
    });

    message.channel.send({ content: `banned ${total} members from ${members.length} selected members` });
}
