module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        //Node.js 静的検証設定 Node.js 固有の変数や構文 (requireや特殊なトップレベル スコープ等) が定義されます。
        "node": true 
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "rules": { //ルールを追加する (初期は何もなし)
      // "ルールの名前"："ルールの設定" error>warn>off エラー(赤) >警告(黄) >何もなし
        "semi": "warn" //セミコロンない場合警告
    }
};

/*
エラー見方

16:1: １６行目の一文字目
error: エラー warn 警告 off なにもなし

no-undef: 未定義の変数を利用している場合に出るエラーです。(no-undefind)

'res' is defined but never used   no-unused-vars
: 定義はしたもの使われていないよという意味
この場合は、気にしない、もしくは「チェック自体を止める」のが正解です。

----------------------------------------------------------
eslint 無効、特定のルールのみ無効にするやり方(jsファイルに記入)

特定の行のみESLintを無効にする： // eslint-disable-line この行のみチェックを除外される

複数行にかけてESLintを無効にする : 
 eslint-disable 
以降から
 eslint-enable 
までのソースコードに対して、ESLintのルールを無効にします。
また、特定のルールを無効にする場合は、先ほどと同様に、eslint-disableの後に無効にしたいルールを記述します。

 eslint-disable no-unused-vars 
から
 eslint-enable no-unused-vars 
*/

//＊＊複数行の場合 /* */をつけること。