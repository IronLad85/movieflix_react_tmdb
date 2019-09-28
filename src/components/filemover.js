var fs = require("fs");
fs.readdir("./", function(err, items) {
  let selfFileIndex = items.indexOf("filemover.js");
  items.splice(selfFileIndex, 1);
  for (var i = 0; i < items.length; i++) {
    var folderName = items[i].split(".")[0];
    var folderPath = `./${folderName}`;
    console.log(items[i], folderPath);
    fs.mkdirSync(folderPath);
    fs.renameSync("./" + items[i], folderPath + "/" + items[i]);
    fs.writeFile(folderPath + "/style.scss", "", err => {});
    fs.writeFile(
      folderName + "/index.js",
      `import ${folderName} from './${items[i]}';\nexport default ${folderName};`,
      err => {
        if (err) console.log(err);
      }
    );
  }
});
