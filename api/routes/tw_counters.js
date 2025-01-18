import express from 'express';
const twCountersRouter = express.Router();
import tw_counters from "../model/tw_counters.js";

//get tw counters
twCountersRouter.get('', async (req, res) => {

    //get allies
    const counters = await tw_counters.get();

    res.json(counters);
  
});

twCountersRouter.post('/', async (req, res) => {
    
    await tw_counters.set(req.body);
    
    res.json({result:true, message: 'Counter successfully changed.' });
  
});

twCountersRouter.get('/export', async (req, res) => {

   
    const excel = await tw_counters.getExcel(req.user.user_name);

    res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "tw_counter.xlsx"
    );

    return excel.xlsx.write(res).then(function () {
    res.status(200).end();
    });
  
});


export default twCountersRouter;
