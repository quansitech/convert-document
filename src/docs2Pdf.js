const common = require("./common");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')
const fs = require('fs')

const Docs2Pdf = {
    copy_files: (paths)=>{
        let fileArr = [];
        let pathArr = Array.isArray(paths) ? paths : paths.split(",")
        const bkDir = __dirname+"/bkDir_"+common.uuid()
        fs.mkdirSync(bkDir)

        for (let i=0; i < pathArr.length; i++){
            let newPath = bkDir+"/"+i+path.extname(pathArr[i])
            fileArr[i] = newPath

            let needCopy = true;
            if (common.isUrl(pathArr[i])){
                throw new Error(pathArr[i]+" url not found")
                // needCopy = false;
                // common.downloadFile(pathArr[i],newPath)
                // pathArr[i] = newPath
            }
            if (!fs.existsSync(pathArr[i])){
                throw new Error(pathArr[i]+" not found")
            }

            needCopy && fs.copyFile(pathArr[i], newPath, (err)=>{
                if(err) throw new Error("copy file failed " + err)
            })
        }

        return {fileArr, bkDir}
    },
    convert_files: async (dir)=>{
        try {
            const { stdout, stderr } = await exec("python3 ./convertto.py "+dir+" -f pdf -a");

            stdout && console.log(`stdout: ${stdout}`);
            stderr && console.error(`stderr: ${stderr}`);

        } catch (error) {
            throw new Error(`python3 error: ${error}`)
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
            throw new Error(`gs error: ${error}`)
        }
    },
    handle:async (paths, out_put) => {
        let bkDir = null;
        try {
            const obj = Docs2Pdf.copy_files(paths)
            bkDir = obj.bkDir

            await Docs2Pdf.convert_files(bkDir)
            await Docs2Pdf.merge_to_pdf(bkDir, out_put)

        }catch (error){
            throw new Error(error)
        }finally {
            bkDir && common.rmdirNotPreserve(bkDir)
        }
    }
}

module.exports = Docs2Pdf;