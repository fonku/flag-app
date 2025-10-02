const express = require("express");
const fs = require("fs");
const app = express();

const PASSWORD = "admin3243"; // パスワード
const DATA_FILE = "flags.json"; // 保存ファイル

// データ読み込み（なければ初期化）
let data = [];
if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// 最新の旗情報を更新
app.get("/update", (req, res) => {
  const { pw, flag } = req.query;
  if (pw !== PASSWORD) {
    return res.send("パスワードが違います ❌");
  }

  const record = {
    time: new Date().toISOString(),
    flag: flag || "なし"
  };

  data.push(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.send("旗を更新しました ✅\n" + JSON.stringify(record));
});

// 最新の旗情報を表示
app.get("/view", (req, res) => {
  const latest = data[data.length - 1] || { time: "", flag: "データなし" };
  res.json(latest);
});

// 全履歴をCSV形式でダウンロード
app.get("/download", (req, res) => {
  let csv = "time,flag\n";
  data.forEach(r => {
    csv += `${r.time},${r.flag}\n`;
  });
  res.setHeader("Content-disposition", "attachment; filename=flags.csv");
  res.set("Content-Type", "text/csv");
  res.send(csv);
});

app.listen(3000, () => console.log("Server started on port 3000"));

app.use(express.static("public"));
