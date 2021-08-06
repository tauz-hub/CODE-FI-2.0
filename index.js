import 'dotenv/config'
if (process.env.NODE_ENV !== 'production')
    dotenv.config();
import discord from "discord.js"
import ytdl from "ytdl-core"

const { url, channelId, token } = process.env
const client = new discord.Client();
let channel;
let broadcast = null;
let interval = null;

if (!token) {
    console.error("token invalido");

} else if (!channelId || Number(channelId) == NaN) {
    console.log("id do canal errado amigo");

} else if (!ytdl.validateURL(url)) {
    console.log("link está errado.");

}

client.on('ready', async() => {
    client.user.setActivity("Coding with Lo-fi");
    channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId);

    if (!channel) {
        console.error("canal não existe");

    } else if (channel.type !== "voice") {
        console.error("id não é de um canal de voz oooo bocó!");

    }

    broadcast = client.voice.createBroadcast();
    let stream = ytdl(url);
    stream.on('error', console.error);
    broadcast.play(stream);
    if (!interval) {
        interval = setInterval(async function() {
            try {
                if (stream && !stream.ended) stream.destroy();
                stream = ytdl(url, { filter: "audioonly", highWaterMark: 100 << 150 });
                stream.on('error', console.error);
                broadcast.play(stream);
            } catch (e) { return }
        }, 1800000)
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
}, 20000);

client.login(token);
