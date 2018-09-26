// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

//= require js.cookie
//= require jstz
//= require browser_timezone_rails/set_time_zone


document.addEventListener('turbolinks:load', () => {
    let path = location.pathname.split('/');
    
    if ((path[0] === "" && path[1] === "") && document.getElementById("dashboard") === null) {
        document.body.style.animationPlayState = "running";
        console.log('Login');

        let text = "de  of, from, by@la  the@el  the@a  to, at@los  the@un  a, an, one@las  the@del  of the, from the, by the@una  a, an, one@al  to the, at the@dos  two@uno  one@cada  each@tres  three@unos  some, a few@que  that, who, which, than@y  and@o  or@como  as, like@pero  but@si  if@porque  because@cuando  when@ni  nor, neither@donde  where@y  and@aunque  although, even though@sino  but, except@mientras  while@en  in, on, into@por  through, for (means), along, by@con  with@para  in order to, for (ends)@sin  without@sobre  about, above, on top of@entre  between, among@hasta  until@desde  from, since@durante  during, for (time)@contra  against@hacia  toward@según  according to@se  himself, herself, itself, yourself, yourselves, themselves@each other@lo  it, that@su  his, her, your@me  (to) me@le  (to) him, her, you@sus  his, her, your, their@yo  I@qué  what(?)@mi  my@nos  (to) us, ourselves@te  (to) you@eso  that@él  he, him@nada  nothing@esto  this@ella  she, her@usted  you@cómo  how(?)@les  (to) them, you@algo  something@ellos  they, them@mí  me@nosotros  we, us@tu  your@@ADVERBS:@no  no, not@más  more@ya  already, now, soon@muy  very@también  also@sí  yes@así  so, thus, like this,@like that@bien  well@solo (solamente)  only@ahora  now@siempre  always@tan  so@entonces  then@después  after, later@menos  less@aquí  here@antes  before, earlier@hoy  today@luego  then, later@además  besides, in addition@casi  almost@nunca  neverVERBS:@es  is, are@ha  has, have@son  are@está  is, are@hay  there is, there are@ser  to be@era  was, were@había  there was, there were@tiene  has, have@fue  was, were@puede  can@han  have@hacer  to make, to do@hace  make(s), do(es)@decir  to say@va  go(es)@estaba  was, were@sea  (might) be@ver  to see@están  are@sido  been@dijo  said@he  I have@creo  I believe@tienen  have@tenía  had@dice  says, say@vamos  we go, we are going@tener  to have@parece  seems, seem@poder  to be able to@pueden  can@este  this@todo  all@esta  this@todos  all, everyone@ese  that@mismo  same@otro  other, another@esa  that@bueno  good@otra  other, another@tanto  so much@otros  other, others@poco  little (not much)@mucho  much@gran  great, big@estos  these@general  general@todas  all, everyone@mayor  bigger, older@mejor  better@toda  all@tal  such@otras  other, others@estas  these@primera  first@algunos  some@los años  years@la vez  time (una vez = once)@la parte  part@la vida  life@el tiempo  time, weather@el día  day@el mundo  world@el estado  state@el gobierno  government@la casa  house@el hombre  man@el país  country@la forma  way@el año  year@el caso  case@el hecho  fact@el momento  moment@las cosas  things@España  Spain@el trabajo  work@los días  days@la política  policy, politics@las veces  times@la gente  people@el lugar  place@el ejemplo  example@las personas  people@la mujer  woman".split("@");

        let english = [];
        let spanish = [];

        for (let x = 0; x < text.length; x++) {
            let phrase = text[x].split(" ");
            english.push(phrase[0]);
            spanish.push(phrase.slice(1).join(" "));
        }

        let englishCounter = 0;
        let spanishCounter = 0;


        setInterval(()=> {
            document.getElementById("englishLogin").innerText = english[englishCounter];
            englishCounter++;
            if (englishCounter === english.length - 1) {
                englishCounter = 0;
            }
        }, 3000);

        let delaySpanish = () => {
            setInterval(()=>{
                document.getElementById("spanishLogin").innerText = spanish[spanishCounter];
                spanishCounter++;
                if (spanishCounter === spanish.length - 1) {
                    spanishCounter = 0;
                }
                
            }, 3000);

        }
        setTimeout(delaySpanish(), 1500);
        

    }
    else  {        
        document.body.style.animationPlayState = "paused";
        

    }

    /*
    if (path[1] === "passages" && parseInt(path[path.length - 1])) {
      let showCurrentPassage = new ShowPassage(document.getElementById('hiddenFeedAnnotationCodeString').innerHTML, 'infoDisplay', 'title');
      showCurrentPassage.instateAnnotations(document.getElementById('hiddenFeedCurrentPassageID').innerHTML,'downloadTXT', 'downloadDOC', 'display'); 
    }
    if (path[1] === "passages" && path[path.length - 1] === "new") {
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.setArticleProcessingTrigger('convertArticleButton', 'articleInput', 'articleOutput', 'articleTitle');
        newPassage.setReturnSelectionTrigger('returnSelectionButton', 'selectedText');
        newPassage.setClearTrigger('clearSelection')
        newPassage.setEntiendifyTrigger('entiendifyButton', 'selectedText', 'translationInfo');
        newPassage.setTransferTranslatedToManualAreaTrigger('translationInfo', 'transferButton', 'manualArea');
        newPassage.setManualBindTrigger('articleOutput', 'manualBindButton', 'manualArea', 'infoDisplay', 'deleteAnnotation');
        newPassage.setVersionControl('undo', 'redo', 'infoDisplay', 'articleOutput', 'deleteAnnotation');
        newPassage.createSaveAlias('finalize', 'save',  'articleTitle', 'passage_title', 'passage_content', 'annotsField');

        newPassage.setAnnotationEdit('infoDisplay', 'articleOutput', 'editAnnotation', 'cancelEditAnnotation', 'deleteAnnotation');
    }
    if (path[1] === "passages" && path[path.length - 1] === "edit") {
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.annotationCode = document.getElementById('hiddenFeedAnnotationCodeString').innerHTML;

        document.getElementById('annotsField').value = newPassage.annotationCode;

        
        
    }*/
});


