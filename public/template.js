/*コンポーネントの仕方 */

/*完成品 */
//グローバルテンプレート
Vue.component('web-template',{
  props:['item'],
  template:
  '<div class="device" v-on:click="Alert">' +
      '<div class="img-box">' +
      '</div>' +
      '<p>{{ item.name }}</p>' +
      '<p>{{ item.day }}</p>' +
      '<p>{{ item.setup }}</p>' +
      '<p>{{ item.com }}</p>' +
    '</div>',

    methods:{
      Alert:function(){
        alert(
         "webサイト名: " + this.item.name +
         "\n作成期間: " + this.item.day +
         "\n主な構成: " + this.item.setup +
         "\n特徴: " + this.item.com)
      }
    }
})

//データの中身
new Vue({
  el:'#createWeb',
  data:{ //複数管理するため関数で返すのでなく配列管理
    webs:[
     { name:"sample1",day:"1日",setup:"js+HTML+CSS",com:"LPサイト"},
     { name:"sample2",day:"2日",setup:"HTML+CSS",com:"LPサイト"},
     { name:"sample3",day:"2日",setup:"js+HTML+CSS",com:"LPサイト"},
     { name:"sample4",day:"1日",setup:"jquery+HTML+CSS+bootstrap",com:"LPサイト"},
     { name:"sample5",day:"3日",setup:"jquery+HTML+CSS",com:"LPサイト"},
     { name:"sample6",day:"4日",setup:"jquery+HTML+CSS+Express+Vue",com:"ブログサイト"},
     { name:"sample7",day:"3日",setup:"jquery+HTML+CSS",com:"LPサイト"},
     { name:"sample8",day:"13日",setup:"jquery+HTML+CSS+Express+Vue-cli+Socket.io",com:"リアルタイムチャット"},
     { name:"sample9",day:"12日",setup:"jquery+HTML+css+Node.js+MySQL",com:"todoアプリ"},
     { name:"sample10",day:"10日",setup:"jquery+HTML+CSS+Express+mongoDB",com:"業務管理サイト"}
    ]
  }
})



/*２
この方法を使えば、それぞれのコンポーネントに違うデータを渡すことが
可能になり、HTMLファイルを見ればどのテンプレートにどのデータが入ってるか
一目でわかります。
しかし、この方法ではデータが多くなりすぎるとHTMLファイルに書く分も
増えてしまいます。（それでもコードの短縮ができている事に変わりはありませんが）

次回はHTMLファイル上でのコードを更に短縮できる方法を紹介いたします。

const Devices = {
  template:
  '<li class="device" v-on:click="popups">' +
    '<div class="img-box">' +
    '</div>' +
    '<div class="info-box">' +
        '<p>device : {{ name }}</p>' +
        '<p>made : {{ made }}</p>' +
        '<p>price : {{ price }}</p>' +
    '</div>' +
  '</li>',
  props: {
    name: String,
    made: String,
    price: Number
  },
  data: function() {
    return {
      name,
      made,
      price
    }
  },
  methods: {
    popups: function() {
      alert("商品名: " + this.name +
            "\n製造: " + this.made +
            "\n値段: " + this.price)
    }
  }
}

new Vue({
el: '#contents',
components: {
  'device-template': Devices
}
})
*/


/*１
これだと同じなものが表示されているので
主なデザイン・構造は同じだけどデータは違う。という場合には使えません。
const Devices = {
    template:
    '<div class="device" v-on:click="popups">' +
      '<div class="img-box">' +
      '</div>' +
      '<div class="info-box">' +
          '<p>Name : {{ name }}</p>' +
          '<p>price : {{ creater }}</p>' +
          '<p>end : {{ end }}</p>' +
      '</div>' +
    '</div>',

    data:function(){
      return{
        name:"ヘッダー",
        creater:"kazuki nausawa",
        end:"2020/02/22"
      }
    },
    methods:{
      popups:function(){
        alert("name : " + this.name +
        "\ncreater : " + this.creater +
        "\nend : " + this.end)
      }
    }

}

new Vue({
  el: '#myheader',
  components: {
    'header-template': Devices
  }
})
*/


/*template 
const DevicesにコンポーネントのHTML部分となるtemplateを書き込みます
前回とほぼ同じですが、{{ name }}, {{ made }}, {{ price }}の前に先ほど
propsで受け取ったitemが挿入されています。
あと、しれっと{{ item.com }}が追加されています。特に意味は無いです。

*/
/*
methods
関数を作成できる
templateと同じくデータの前にitemが挿入されています。
*/
/*data
template部分に適応されるデータを設定します。
コンポーネントに対してデータを渡す場合、dataは関数にする必要があります。
データを指定していれば、初期値を設定することができます。

ここが今回の大きな変更点の一つです。
データを関数として返すのではなく、配列で管理しています。
devicesに今回使用するname, made, price, comのデータを入力していきます
*/


/*new Vue
el対象のエレメントを指定します。<header-template>にDevicesを代入
templateがグローバルになっているので
個別で指定する必要がなくなりました。
*/

/*
props
親要素からデータを受け取る。
Vue公式では型の指定を推奨されている
親要素からデータを受け取ります。受け取ったデータはitemに代入されます。
*/

/*
Vue.component
今回はコンポーネントの使用可能範囲を設定せずに、
グローバルで使用できるコンポーネントとして作成してみます。
*/


/*

<!--コンポーネントjs ページに反映するのでheadでなくbody-->
<script type="text/javascript" src="template.js"></script> 


<h1>作品一覧</h1>
<div class="scroll_wrapper">
  <div class="scroll_inner">
<div id="createWeb">
  <web-template
   v-for="websyte in webs"
   v-bind:key="websyte.name"
   v-bind:item="websyte">

  </web-template>
</div>
</div>
</div>
*/
