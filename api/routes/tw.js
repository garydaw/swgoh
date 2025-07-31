import express from 'express';
const twRouter = express.Router();
import teams from "../model/teams.js";

//get tw teams
twRouter.get('', async (req, res) => {

    //get teams
    const twTeams = await teams.get(req.query.ally_code, "tw");

    res.json(twTeams);
  
});

twRouter.post('', async (req, res) => {

    const { teamType, teamPost, offence, defence } = req.body;
    //set team
    await teams.set('tw', teamType.substring(3), teamPost, offence, defence);

    res.json([]);
  
});

twRouter.get('/export', async (req, res) => {

   
    const excel = await teams.getExcel(req.user.user_name, 'tw');

    res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "TW.xlsx"
    );

    return excel.xlsx.write(res).then(function () {
    res.status(200).end();
    });
  
});


export default twRouter;
