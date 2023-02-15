const crypto = require('crypto')
const request =  require('request')
const fs =  require('fs')


const Common = {
    isUrl:(url)=>{
        const urlReg = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
        return urlReg.test(url);
    },
    uuid:()=>{
        return crypto.randomBytes(16).toString("hex");
    },
    downloadFile: (from, to) =>{
        let stream = fs.createWriteStream(to)
        request(from).pipe(stream).on('close', function (err){
            console.log('down ok'+ from)
            if(err) throw "down " +from+ " failed"+ err

        })
    },
    rmdir:(dir)=>{
        if (fs.existsSync(dir)){
            let files = fs.readdirSync(dir)
            let childPath = null
            files.forEach(child => {
                childPath = `${dir}/${child}`
                if (fs.statSync(childPath).isDirectory()){
                    Common.rmdir(childPath)
                    fs.rmdirSync(childPath)
                }else{
                    fs.unlinkSync(childPath)
                }
            })
        }else{
            console.log(dir+" dir not found")
            throw dir+" dir not found"
        }
    },
    rmdirNotPreserve:(dir)=>{
        Common.rmdir(dir);
        fs.existsSync(dir) && fs.rmdirSync(dir)
    },
    combineFilesName:(dir, spe = ' ')=>{
        if (fs.existsSync(dir)){
            return fs.readdirSync(dir, (err, files) => {
                if (err){
                    throw `读取目录失败 ${err}`
                }
            }).map(item => dir+"/"+item).join(spe)
        }else{
            throw dir+" not found"
        }
    },
    restartErr: (msg) =>{
        return msg.indexOf("python3 error:") !== -1 || msg.indexOf("gs error:") !== -1
    }
}

module.exports = Common