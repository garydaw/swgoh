import express from 'express';
const swgohRouter = express.Router();
import units from "../model/units.js";
import players from "../model/players.js";


//refresh guild
swgohRouter.get('/guild/:guild_id', async (req, res) => {

    const guild_id = req.params.guild_id;

    //get units
    await units.refreshUnits();

    //get allies
    await players.refreshAllies(guild_id);


    res.json({ message:"Guild refreshed"});
  
});

swgohRouter.post('/units', async (req, res) => {
    
    await units.refreshUnits(req.body);
    
    res.json({result:true, message: 'Units successfully updated.' });
  
});

swgohRouter.post('/alliesArray', async (req, res) => {

    await players.refreshAllies(req.body);
    const allies =  await players.getGuildMembersRefresh();
    
    res.json({result:true, message: 'Guild successfully updated.' });
  
});

swgohRouter.post('/allies', async (req, res) => {
    
    let response = req.body
    //find guild members
    let text_start = 0;
    const text = '<a href="/p/';
    text_start = response.data.indexOf(text, text_start) + text.length;
    
    let guild_ally_codes = [];

    while(text_start !== text.length-1){
        guild_ally_codes.push(response.data.substr(text_start, 9))
        text_start = response.data.indexOf(text, text_start) + text.length;
    }

    await players.refreshAllies(guild_ally_codes);
    const allies =  await players.getGuildMembersRefresh();
    
    res.json(allies);
  
});

swgohRouter.get('/allies', async (req, res) => {
    
    const allies =  await players.getGuildMembersRefresh();
    
    res.json(allies);
  
});

swgohRouter.post('/player', async (req, res) => {
    
    await players.update(req.body);
    
    const allies =  await players.getGuildMembersRefresh();
    
    res.json(allies);
  
});


export default swgohRouter;
