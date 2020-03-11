/*eslint-disable no-unused-vars  */  //定義はしたものの一度も使ってない変数のときはエラー表示しないよう括る。

var express = require('express'),
    logger  = require('morgan'),
    bodyParser = require('body-parser'),
  //  connect    = require('connect'),
    methodOverride = require('method-override'),
   // cookieParser = require('cookie-parser'),
    //session = require('express-session'),
    //csrf    = require('csurf');   //csrf対策
    Qiita = require('qiita'), //QiitaAPI用
    multer = require('multer'), //アップロードされたファイルを受け取る
    cloudinary = require('cloudinary'), //画像サーバー使用

app = express();

//ルーティングエクスポート
var post = require('./routes/post');
//publicフォルダ全取得
app.use(express.static(__dirname+'/public')); //publicフォルダ全読み込み

//multerの設定(画像アップロードのため)
const upload = multer({ dest: './upload' });

//画像サーバ(cloudinary)設定
cloudinary.config({
  cloud_name:'dqndwvhf2',
  api_key:'563469991184368',
  api_secret:'CNMktuy2LYuZ1PxQGY7h5Gu80yA'
});

/*データベース使用のため宣言する*/
var mongoose = require('mongoose');//mongoose
mongoose.connect('mongodb://localhost:27017/myMongo2',{
  useUnifiedTopology : true, //２つつけないとエラー表示
  useNewUrlParser: true 
});

//データ管理
var Schema = mongoose.Schema;
var Docs = new Schema({
  day :Number, //データ日付
  name:String, //名前 タイトル
  img: String, //jpegソース タイトル画像
  client:String, //クライアント側 どのような構成か
  server:String, //サーバー側はどのような構成か
  /*ここは後で調べる */
  date:{
    default: Date.now,
    type: Date,
  }
 });

//モデル
 var sampleModel = mongoose.model('webs',Docs); //(コレクション,スキーマ)


//middleware
app.use(bodyParser.urlencoded({extended: true})); //post操作のjsonとurlencoded使うため
app.use(bodyParser.json());
app.use(methodOverride((req, res) => {    //put,delete対応
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//csrf対策
/*
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}))
app.use(csrf());
app.use((req,res,next)=>{  
    res.locals.csrftoken = req.csrfToken(); 
    next();
});
*/
app.use(logger('dev')); //開発ログ出力

/*エラー処理 */



///////////ruting///////////

app.get('/',post.index); //トップ画面

//アップロード
app.get('/upload',(req,res)=>{
  res.send("投稿確認画面だよ");
});

//アップロードしたファイルを保存 
app.post('/upload', upload.single('file'), function (req, res) {
  res.send(req.file.originalname + 'ファイルのアップロードが完了しました。');
  console.log(req.file);
});


//DB全表示
app.get('/api',(req,res)=>{
  //model
  sampleModel.find({},(err,docs)=>{
     res.json(docs);
  });
});

//番号検索（条件に合うもの複数表示
app.get('/api/:day',(req,res)=>{ 
  sampleModel.find({day:req.params.day},(err,docs)=>{
    res.json(docs);
  });
});
//番号を取得して削除 おそらくjson.parseすれば年齢だけでなく名前で（ひらがな）検索や削除できるはず
app.delete('/api/:day',(req,res)=>{
  sampleModel.deleteOne({day:req.params.day},(err,docs)=>{ //{}空だと先頭一つ削除
    if(err) return console.log(err);
    console.log("削除しました");
  });
});

//DB追加
//第２引数にuploadを入れることで画像を保存
app.post('/api',upload.single('img'),(req,res,next)=>{
  /*
  req.bodyにてPOSTされた内容が{}でJSON形式で入る
  {
  day: '20200228',
  name: 'kazuki',
  img: '014952278a7dbfb19756b5299e8f75ccd891916140.jpg',
  client: 'Vue.js+jqeury',
  server: 'Node.js(Express)+mongoDB'
  }
  逆にreq.body.dayのようにPOSTされたときのnameを指定すればそこだけ表示される
  結果：20200228
  */
 /*
 画像を保存するやり方（test
 まずapp.postにmulterのupload.single('img')でfileのnameを取得し、multerでローカルサーバ保存
 次にreq.file.pathにてfileのpathを取得し、変数pathに代入
 cloudinary.uploader.upload(path,(result)=>{})にて、
 cloudinaryサーバーにアップした画像をpathを指定し、取得
 引数resultにて取得した結果の画像URL result.urlをimagePathに代入
 さらにreq.body.imgにてアップするときの画像の名前が入ってるのでそれに画像URLを代入
 そしていつも通りinsertし、Vueからimgで画像のURLを取得させる。
 */

  var path = req.file.path; //アップした画像fileのパッチ

  //cloudinaryに保存された画像を取得
  cloudinary.uploader.upload(path,(result)=>{

    var imagePath = result.url; //アップした画像のURLを代入
    req.body.img = imagePath; //req.body.imgには最初の画像の名前(XXX.jpg)が入ってるがそこにアップした画像のURLに差し替える

    var todoObj = new sampleModel(req.body); //new でreq.body データをDBに格納
    console.log(`req.body: ${JSON.stringify(req.body)} inserted!`); //req.body.img URL変換した後のログ

    //DB処理
    todoObj.save(err=>{
      if(err) return console.log(err); //セーブしてる間すぐリダイレクトしないようエラーの後記述
      res.redirect('/');
    });
  });

});



//アクセスしたら投稿
app.post('/qiita',(req,res)=>{

  //Qiita設定
  let q = new Qiita({token:'10aab22613a7a4541b714ddb7ca4e1cacc636882'});
  
  let postdata = {
  title: req.body.title, //nameのtitleから取得
  body:  req.body.body,           
  tags:[{name:req.body.tags}],
  private: true   //falseにすれば公開状態で投稿できる（テスト用投稿はtrue
  };

  q.items.post(postdata, (err, res, body) => {
    if(err) return;
    console.log('qiitaに投稿しました');
  });

  res.redirect('/');
});



/* 定義してないときはコメントアウト必ずする
app.get('/posts/:id([0-9]+)',post.show);//詳細画面 プレースホルダー使用のため正規表現
app.get('/posts/new',post.new); //新規作成
app.post('/posts/create',post.create);  //記事生成
app.get('/posts/:id/edit',post.edit);  //編集フォーム表示
app.put('/posts/:id',post.update);  //フォームの投稿先 更新
app.delete('/posts/:id',post.destroy); //投稿削除
*/
app.listen(3000);
console.log("localhost:3000 server起動"); 

/*eslint-enable no-unused-vars */
