import 'dotenv/config'
if (process.env.NODE_ENV !== 'production')
  dotenv.config();
import discord from "discord.js"
import ytdl from "ytdl-core"

const { url, channelId, token } = process.env
const client = new discord.Client();
let channel,
    broadcast = null,
    interval = null;

if (!token) {
    console.error("token invalido");
} else if (!channelId || !Number(channelId)) {
    console.log("id do canal inválido");
} else if (!ytdl.validateURL(url)) {
    console.log("link do vídeo inválido.");

}

client.on('ready', async() => {

    let status = [
        `❤️Rafaella Ballerini on Youtube!❤️`,
        `💜Rafaella Ballerini on Twitch!💜`,
        `🧡Rafaella Ballerini on Instagram!🧡`,
        `🎧Coding with Lo-fi!🎧`,
        `⭐Stream Lo-fi!⭐`,
        `👨‍💻Contact Tauz for questions about me😺`

    ];
    let i = 0;

    setInterval(() => client.user.setActivity(`${status[i++ %
    status.length]}`, {
        type: 'WATCHING'
    }), 5000);

    channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId);
    if (!channel) {
        console.error("canal não existe");

    } else if (channel.type !== "voice") {
        console.error("id não é de um canal de voz");

    }
    broadcast = client.voice.createBroadcast();


    let stream = ytdl(url);



    stream.on('error', console.error);
    broadcast.play(stream);
    if (!interval) {
        interval = setInterval(async function() {
            try {
                if (stream && !stream.ended) {
                    stream = ytdl(url);
                    stream.on('error', console.error);
                    broadcast.play(stream);
                }
            } catch (e) { return }
        }, 900000)
    }
    try {
        const connection = await channel.join();
        connection.play(broadcast);
    } catch (error) {
        console.error(error);
    }
});

setInterval(async function() {
    if (!client.voice.connections.size) {

        if (!channel) return;
        try {
            const connection = await channel.join();
            connection.play(broadcast);
        } catch (error) {
            console.error(error);
        }
    }
}, 15000);

client.login(token);
