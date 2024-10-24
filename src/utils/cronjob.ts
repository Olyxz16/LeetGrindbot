import {CronJob} from 'cron';
import getRandomProblem from "../utils/getProblem"
import config from "../config/index";
import createEmbeds from "../embeds/leetCodeEmbeds";
import {getRandomDifficulty} from "./getRandom";
import log from "../logger";

export default function createJob(client : any) : CronJob {
    return new CronJob(
        '0 18 * * *',
        () => sendNewProblem(client),
        null,
        false,
        'Europe/Paris'
    );
}

export async function sendNewProblem(client : any) {
    const guildId = config.guildId;
    const channelId = config.channelId;
    if(guildId == "") {
        log.error("Empty guildId");
        return;
    }
    if(channelId == "") {
        log.error("Empty channelId");
        return;
    }

    const difficulty: number = getRandomDifficulty();
    const [code, text, url] = await getRandomProblem(difficulty);

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        log.error('Guild not found!');
        return;
    }
    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
        log.error('Channel not found!');
        return;
    }
    await channel.send({embeds: [createEmbeds(url, text, difficulty)]});
}
