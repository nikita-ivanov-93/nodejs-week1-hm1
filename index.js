const path = require("path")
const fs = require("fs")
const util = require("util");

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const copyFile = util.promisify(fs.copyFile);
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);

const oldDir = process.argv[2];
const newDir = process.argv[3];
const deleteOldDir = process.argv[4];
if (!oldDir) {
  console.log("Введите начальную папку с файлами")
  return;
}
if (!newDir) {
  console.log("Введите конечную папку с файлами")
  return;
}
if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir)
}
  
(async function readDir(dir) {
  try {
    const files = await readdir(dir);
    files.forEach(async (item) => {
      try {
        let localBase = path.join(dir, item);
        let state = await stat(localBase);
        if (state.isDirectory()) {
          readDir(localBase);
        } else {
          const firstSymbol = item[0];
          const newDirName = `${newDir}/${firstSymbol}`
          if (!fs.existsSync(newDirName)) {
            fs.mkdirSync(newDirName);
          }
          const oldPath = path.join(__dirname, localBase);
          const newPath = path.join(__dirname, newDirName, item);
          if (!fs.existsSync(newPath)) {
            await copyFile(oldPath, newPath)
          }
        }
      } catch (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
})(oldDir);

if (deleteOldDir === "d") {
  fs.rmdirSync(oldDir, { recursive: true });
}