const express = require('express')
const Docs2Pdf = require("./docs2Pdf")
const Common = require("./common")

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post('/', async function (req, res) {

    let { paths, out_put } = req.body;

    try{
        await Docs2Pdf.handle(paths, out_put)
    }
    catch(e){
        console.log(e);
        res.send({
            code: -1,
            msg: e.message
        });
        if (Common.restartErr(e.message)){
            process.exit(0)
        }else{
            return;
        }
    }

    res.send({
        code: 0,
        msg: 'success'
    })
})

app.listen(3000)