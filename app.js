const OLD = ["創世記","出埃及記","利未記","民數記","申命記","約書亞記","士師記","路得記","撒母耳記上","撒母耳記下","列王紀上","列王紀下","歷代志上","歷代志下","以斯拉記","尼希米記","以斯帖記","約伯記","詩篇","箴言","傳道書","雅歌","以賽亞書","耶利米書","耶利米哀歌","以西結書","但以理書","何西阿書","約珥書","阿摩司書","俄巴底亞書","約拿書","彌迦書","那鴻書","哈巴谷書","西番雅書","哈該書","撒迦利亞書","瑪拉基書"];
const NEW = ["馬太福音","馬可福音","路加福音","約翰福音","使徒行傳","羅馬書","哥林多前書","哥林多後書","加拉太書","以弗所書","腓立比書","歌羅西書","帖撒羅尼迦前書","帖撒羅尼迦後書","提摩太前書","提摩太後書","提多書","腓利門書","希伯來書","雅各書","彼得前書","彼得後書","約翰一書","約翰二書","約翰三書","猶大書","啟示錄"];
const $ = id => document.getElementById(id);
const CATEGORIES = [
  {name:"摩西五經", books:["創世記","出埃及記","利未記","民數記","申命記"]},
  {name:"歷史書", books:["約書亞記","士師記","路得記","撒母耳記上","撒母耳記下","列王紀上","列王紀下","歷代志上","歷代志下","以斯拉記","尼希米記","以斯帖記"]},
  {name:"詩歌智慧書", books:["約伯記","詩篇","箴言","傳道書","雅歌"]},
  {name:"大先知書", books:["以賽亞書","耶利米書","耶利米哀歌","以西結書","但以理書"]},
  {name:"小先知書", books:["何西阿書","約珥書","阿摩司書","俄巴底亞書","約拿書","彌迦書","那鴻書","哈巴谷書","西番雅書","哈該書","撒迦利亞書","瑪拉基書"]},
  {name:"四福音書", books:["馬太福音","馬可福音","路加福音","約翰福音"]},
  {name:"教會歷史書", books:["使徒行傳"]},
  {name:"保羅書信", books:["羅馬書","哥林多前書","哥林多後書","加拉太書","以弗所書","腓立比書","歌羅西書","帖撒羅尼迦前書","帖撒羅尼迦後書","提摩太前書","提摩太後書","提多書","腓利門書"]},
  {name:"普通書信", books:["希伯來書","雅各書","彼得前書","彼得後書","約翰一書","約翰二書","約翰三書","猶大書"]},
  {name:"預言書", books:["啟示錄"]}
];
let questions=[], index=0, correct=0, wrong=[], answered=false, lastScope="all", lastCount=20, lastMode="order", lastDifficulty="normal", timerInterval=null, timeLeft=40;

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function poolFor(scope){return scope==="old"?OLD:scope==="new"?NEW:[...OLD,...NEW];}
function startQuiz(scope,count,onlyWrong=null,mode=$("game-mode").value,difficulty=$("difficulty").value){
  lastScope=scope;lastCount=count;lastMode=mode;lastDifficulty=difficulty;
  const pool=poolFor(scope);
  const chosen=onlyWrong?shuffle(onlyWrong):shuffle(pool).slice(0,Math.min(count,pool.length));
  questions=chosen.map(book=>({book,scope:OLD.includes(book)?"舊約":"新約",category:CATEGORIES.find(c=>c.books.includes(book))?.name||"其他"}));
  index=0;correct=0;wrong=[];answered=false;
  $("setup").classList.add("hidden");$("result").classList.add("hidden");$("quiz").classList.remove("hidden");
  $("scope-label").textContent=(scope==="old"?"舊約":scope==="new"?"新約":"新舊約混合")+(mode==="category"?"・分類配對":"・目錄抽考");
  renderQuestion();
}
function stopTimer(){
  if(timerInterval!==null){clearInterval(timerInterval);timerInterval=null;}
}
function startTimer(){
  stopTimer();
  timeLeft=40;
  const value=$("timer-value"), bar=$("timer-bar");
  value.textContent=timeLeft;
  bar.style.width="100%";
  bar.classList.remove("urgent");
  timerInterval=setInterval(()=>{
    timeLeft--;
    value.textContent=timeLeft;
    bar.style.width=`${Math.max(0,timeLeft/40*100)}%`;
    if(timeLeft<=10)bar.classList.add("urgent");
    if(timeLeft<=0){
      stopTimer();
      if(!answered){
        answered=true;
        const q=questions[index], expected=lastMode==="category"?q.category:q.book;
        wrong.push({book:q.book,answer:"時間到（未作答）",expected,mode:lastMode});
        nextQuestion();
      }
    }
  },1000);
}
function renderQuestion(){
  stopTimer();
  answered=false;
  const q=questions[index], pool=q.scope==="舊約"?OLD:NEW;
  let opts=[];
  if(lastMode==="category"){
    $("question-hint").textContent="書卷分類配對";
    $("question-title").textContent=`「${q.book}」屬於哪一類書卷？`;
    $("book-list").innerHTML=`<div class="category-prompt"><span class="category-book-icon">📖</span><span class="category-book-name">${q.book}</span><span class="category-book-sub">請選擇正確的分類</span></div>`;
    const categories=CATEGORIES.map(c=>c.name);
    opts=shuffle([q.category,...shuffle(categories.filter(c=>c!==q.category)).slice(0,3)]);
  }else{
    $("question-hint").textContent="請選出空格中正確的聖經書卷";
    $("question-title").textContent="以下目錄中，缺少的是哪一卷？";
    const pos=pool.indexOf(q.book);
    const beforeCount=lastDifficulty==="easy"?1:lastDifficulty==="normal"?1:2;
    const afterCount=lastDifficulty==="easy"?0:lastDifficulty==="normal"?1:2;
    const start=Math.max(0,pos-beforeCount);
    const end=Math.min(pool.length-1,pos+afterCount);
    const visibleBooks=[];
    for(let bookIndex=start;bookIndex<=end;bookIndex++){
      if(bookIndex===pos) visibleBooks.push(`<div class="book-item blank"><span class="num">${bookIndex+1}.</span><span>？　＿＿＿＿</span></div>`);
      else visibleBooks.push(`<div class="book-item"><span class="num">${bookIndex+1}.</span><span>${pool[bookIndex]}</span></div>`);
    }
    $("book-list").innerHTML=visibleBooks.join("");
    const difficultyNames={easy:"簡單",normal:"普通",hard:"困難"};
    $("question-hint").textContent=`${difficultyNames[lastDifficulty]}難度：依照相鄰書卷判斷`;
    opts=shuffle([q.book,...shuffle(pool.filter(b=>b!==q.book)).slice(0,3)]);
  }
  $("options").innerHTML=opts.map((b,i)=>`<button class="option" data-answer="${b}"><span class="letter">${"ABCD"[i]}</span>${b}</button>`).join("");
  $("options").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.answer)));
  $("progress-label").textContent=`第 ${index+1} / ${questions.length} 題`;
  $("progress-bar").style.width=`${index/questions.length*100}%`;
  $("feedback").className="feedback hidden";$("next-btn").classList.add("hidden");
  startTimer();
}
function choose(answer){
  if(answered)return;answered=true;stopTimer();
  const q=questions[index], expected=lastMode==="category"?q.category:q.book, isCorrect=answer===expected;
  if(isCorrect)correct++;else wrong.push({book:q.book,answer,expected,mode:lastMode});
  $("options").querySelectorAll("button").forEach(btn=>{
    btn.disabled=true;
    if(btn.dataset.answer===expected)btn.classList.add("correct");
    else if(btn.dataset.answer===answer)btn.classList.add("incorrect");
  });
  const fb=$("feedback");fb.className=`feedback ${isCorrect?"good":"bad"}`;
  fb.innerHTML=isCorrect?`<strong>答對了！太棒了！🎉</strong><br>正確答案是：${expected}`:`<strong>再加油！</strong><br>你選擇了「${answer}」，正確答案是「${expected}」。`;
  $("next-btn").textContent=index===questions.length-1?"查看成績 →":"下一題 →";
  $("next-btn").classList.remove("hidden");
}
function nextQuestion(){if(index<questions.length-1){index++;renderQuestion();}else showResult();}
function showResult(){
  stopTimer();
  $("quiz").classList.add("hidden");$("result").classList.remove("hidden");
  const total=questions.length, pct=Math.round(correct/total*100), score=Math.round(correct/total*100);
  $("score").textContent=score;$("correct-count").textContent=correct;$("wrong-count").textContent=wrong.length;$("accuracy").textContent=pct+"%";
  $("result-message").textContent=pct===100?"太厲害了！全部答對，已經熟悉這回合的目錄！":pct>=80?"表現很好！再練習幾次就能更加熟悉聖經目錄。":pct>=60?"做得不錯，看看錯題再挑戰一次吧！":"別氣餒，透過錯題重練會越來越熟悉！";
  const review=$("wrong-review"), list=$("wrong-list");
  if(wrong.length){review.classList.remove("hidden");list.innerHTML=wrong.map((w,i)=>`<div class="wrong-row">${i+1}. ${w.mode==="category"?`書卷：${w.book}；正確分類：`:`正確答案：`}<strong>${w.expected||w.book}</strong>　你的答案：${w.answer}</div>`).join("");}
  else review.classList.add("hidden");
}
$("start-btn").addEventListener("click",()=>startQuiz($("scope").value,Number($("question-count").value),null,$("game-mode").value,$("difficulty").value));
$("next-btn").addEventListener("click",nextQuestion);
$("quit-btn").addEventListener("click",()=>{if(confirm("確定要結束本回合嗎？目前成績將不會保留。")){stopTimer();$("quiz").classList.add("hidden");$("setup").classList.remove("hidden");}});
$("again-btn").addEventListener("click",()=>startQuiz(lastScope,lastCount,null,lastMode,lastDifficulty));
$("home-btn").addEventListener("click",()=>{$("result").classList.add("hidden");$("setup").classList.remove("hidden");});
$("retry-wrong-btn").addEventListener("click",()=>startQuiz(lastScope,wrong.length,wrong.map(w=>w.book),lastMode,lastDifficulty));
