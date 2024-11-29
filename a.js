const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, REST, Routes } = require('discord.js');
const TOKEN = "MTMwMjYxNDcwNjk2MzM0OTUxNA.GeqIBk.Xuol8O_Y8VSVF724B-vQIcuePQxNdCAvC-fh4w";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// 當機器人準備就緒時觸發
client.once('ready', async () => {
    console.log(`目前登入身份 --> ${client.user.tag}`);

    // 註冊斜線指令
    const commands = [
        new SlashCommandBuilder()
            .setName('改名稱')
            .setDescription('改名稱')
            .addUserOption(option => option.setName('member').setDescription('要改誰').setRequired(true))
            .addStringOption(option => option.setName('nickname').setDescription('要改成甚麼').setRequired(true))
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log(`載入 ${data.length} 個斜線指令`);
    } catch (error) {
        console.error(error);
    }
});

// 每 5 分鐘檢查機器人是否線上
setInterval(() => {
    if (!client.isReady()) {
        client.login(TOKEN).catch(console.error);
    }
}, 5 * 60 * 1000);

// 當接收到訊息時觸發
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const text = message.content;
    const authorId = message.author.id;

    if (text.includes('范翔皓')) {
        for (let i = 0; i < 3; i++) {
            await message.channel.send(`<@${authorId}> 你是范翔皓`);
        }
        try {
            await message.react('<:you:1302605122815393862>');
        } catch (err) {
            console.error('無法添加反應：', err);
        }
    }
    console.log(`from: ${message.author.tag}  message: ${text}`);
});

// 斜線指令：改名稱
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === '改名稱') {
        const member = options.getUser('member');
        const nickname = options.getString('nickname');
        const guildMember = interaction.guild.members.cache.get(member.id);

        if (!guildMember) {
            return interaction.reply({ content: '找不到該成員。', ephemeral: true });
        }

        try {
            if (guildMember.user.username !== 'hung100liu') {
                await guildMember.setNickname(nickname);
                await interaction.reply(`${guildMember.displayName} 的暱稱已更改為 ${nickname}！`);
            } else {
                await interaction.reply('你不能改 o((>ω< ))o');
            }
        } catch (error) {
            console.error('無法更改暱稱：', error);
            await interaction.reply('更改暱稱時發生錯誤。');
        }
    }
});

client.login(TOKEN);
