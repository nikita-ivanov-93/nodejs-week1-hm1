const path = require("path")
const fs = require("fs")

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
fs.access(newDir, (err)=> {
  if (err) {
    fs.mkdir(newDir, (err)=> {
      if (err) {
        console.log(`Проблема с созданием новой папки ${newDir}`);
        return;
      };
      readDir(oldDir);
    })
  };
})
const readDir = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log('Reading problem!');
      return;
    };
    files.forEach(item => {
      let localBase = path.join(dir, item);
      fs.stat(localBase, (err, state) => {
        if (err) {
          console.log(`Проблема с получением данных о файле ${localBase}`);
          return;
        };
        if (state.isDirectory()) {
          readDir(localBase);
        } else {
          const firstSymbol = item[0];
          const newDirName = `${newDir}/${firstSymbol}`;
          fs.access(newDirName, (err)=> {
            if (err) {
              fs.mkdir(newDirName, (err)=> {
                if (err) {
                  console.log(`Проблема с созданием новой папки ${newDirName}`);
                  return;
                };
              })
            };
          })
          const oldPath = path.join(__dirname, localBase);
          const newPath = path.join(__dirname, newDirName, item);
          fs.access(newPath, (err)=> {
            if (err) {
              fs.copyFile(oldPath, newPath, (err) => {
                if (err) {
                  console.log(`Не удалось скопировать файл ${newDirName}`);
                  return;
                }
              })
            }
          })
        }
      })
    })
  }); 
}

if (deleteOldDir === "d") {
  fs.rmdir(oldDir, { recursive: true }, (err) => {
    if (err) {
      console.log(`Не удалось удалить папку ${oldDir}`)
    }
  });
}