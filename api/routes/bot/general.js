import express from 'express';
const generalRouter = express.Router();
import players from "../../model/players.js";

generalRouter.get('/player/check/:userId/:displayName', async (req, res) => {
    const { userId, displayName } = req.params;

    const discordPlayer = await players.getPlayerByDiscordId(userId);

    if (discordPlayer) {
        res.json({ exists: true, player: discordPlayer });
        return;
    }
    const possiblePlayers = await players.getPlayersByDisplayName(displayName);

    res.json({ exists: false, possiblePlayers:possiblePlayers });
});

generalRouter.post('/player/link', async (req, res) => {
    const { discord_id, ally_code } = req.body;

    const player = await players.getPlayerByAllyCode(ally_code);

    if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
    }

    await players.linkDiscordIdToPlayer(discord_id, ally_code);

    res.json({ player });
});


export default generalRouter;
