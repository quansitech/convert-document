const common = require("./common");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')
const fs = require('fs')

const Docs2Pdf = {
    copy_files: (paths, bkDir)=>{
        let fileArr = [];
        let pathArr = Array.isArray(paths) ? paths : paths.split(",")


        for (let i=0; i < pathArr.length; i++){
            let newPath = bkDir+"/"+i+path.extname(pathArr[i])
            fileArr[i] = newPath

            let needCopy = true;
            if (common.isUrl(pathArr[i])){
                throw pathArr[i]+" url not found"
                // needCopy = false;
                // common.downloadFile(pathArr[i],newPath)
                // pathArr[i] = newPath
            }
            if (!fs.existsSync(pathArr[i])){
                throw pathArr[i]+" not found"
            }

            needCopy && fs.copyFile(pathArr[i], newPath, (err)=>{
                if(err) throw "copy file failed " + err
            })
        }

        return fileArr
    },
    convert_files: async (dir)=>{
        try {
            const { stdout, stderr } = await exec("python3 ./convertto.py "+dir+" -f pdf -a");

            stdout && console.log(`stdout: ${stdout}`);
            stderr && console.error(`stderr: ${stderr}`);
            if (stdout && stdout.indexOf("ErrCode: 0x80000008")){
                throw stdout
            }

            return true;
        } catch (error) {
            throw `python3 error: ${error}`
        }
    },
    merge_to_pdf: async (dir, out_put) =>{
        try {
            const outDir = dir+"/out/"
            const fileStr = common.combineFilesName(outDir);

            const { stdout, stderr } = await exec("gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE="+out_put+" -dBATCH "+fileStr)

            stdout && console.log(`stdout: ${stdout}`);
            stderr && console.error(`stderr: ${stderr}`);

        } catch (error) {
            throw `gs error: ${error}`
        }
    },
    handle:async (paths, out_put) => {
        const bkDir = __dirname+"/bkDir_"+common.uuid()
        try {
            fs.mkdirSync(bkDir)

            const obj = Docs2Pdf.copy_files(paths,bkDir)
            if (obj){
                const convert_r = await Docs2Pdf.convert_files(bkDir)
                convert_r === true && await Docs2Pdf.merge_to_pdf(bkDir, out_put)
            }

        }catch (error){
            throw new Error(error)
        }finally {
            common.rmdirNotPreserve(bkDir)
        }
    }
}

module.exports = Docs2Pdf;