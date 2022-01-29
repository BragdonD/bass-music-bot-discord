import { Client, Intents } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import youtubeSearch from "youtube-search";
import dotenv from "dotenv";
import musicBot from "./bot.mjs";
import { createErrorJoinChannel, sendEmbedMessage } from "./messages.mjs";

dotenv.config();

const client = new Client( { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ] } );

client.login( process.env.BOT_TOKEN );

let bot = new musicBot({client: client});

client.on("messageCreate", async (message) => {
    try {
        if(message.content.startsWith("!play")) {
            const nameOfTheSong = message.content.split("!play").pop();
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel) {
                await sendEmbedMessage( message, await createErrorJoinChannel( client ) );
                return;
            }
            else {
                if(!bot.connection.connectionChannel) {
                    bot.joinChannel(voiceChannel, message);
                }
                if(nameOfTheSong.length > 0) {
                    const songInformations = await bot.searchAudio(nameOfTheSong);
                    const audioRessouce = await bot.getAudio(songInformations.SearchInfo.id);
                    bot.addAudio(audioRessouce, songInformations, message);
                    if(bot.player.state.status == AudioPlayerStatus.Idle) {
                        bot.playAudio();
                    }
                }
            }      
        }
        else if(message.content.startsWith("!skip")) {
            bot.skipAudio();
        }
        else if(message.content.startsWith("!pause")) {
            bot.pauseAudio();
        }
        else if(message.content.startsWith("!unpause")) {
            bot.continueAudio();
        }
        else if(message.content.startsWith("!leave")) {
            bot.leave();
        }
    }
    catch (e) {
        console.log(e);
    } 
})