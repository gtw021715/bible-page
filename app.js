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
  {name:"新約歷史書", books:["使徒行傳"]},
  {name:"保羅書信", books:["羅馬書","哥林多前書","哥林多後書","加拉太書","以弗所書","腓立比書","歌羅西書","帖撒羅尼迦前書","帖撒羅尼迦後書","提摩太前書","提摩太後書","提多書","腓利門書"]},
  {name:"一般書信", books:["希伯來書","雅各書","彼得前書","彼得後書","約翰一書","約翰二書","約翰三書","猶大書"]},
  {name:"預言書", books:["啟示錄"]}
];
let questions=[], index=0, correct=0, wrong=[], answered=false, fiftyUsed=false, lastScope="all", lastCount=10, lastMode="order", lastDifficulty="normal", timerInterval=null, timeLeft=40, timerDeadline=0, bibleUsed=false, teacherUsed=false;

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function poolFor(scope){return scope==="old"?OLD:scope==="new"?NEW:[...OLD,...NEW];}
function startQuiz(scope,count,onlyWrong=null,mode=$("game-mode").value,difficulty=$("difficulty").value){
  lastScope=scope;lastCount=count;lastMode=mode;lastDifficulty=difficulty;
  const pool=poolFor(scope);
  const chosen=onlyWrong?shuffle(onlyWrong):shuffle(pool).slice(0,Math.min(count,pool.length));
  questions=chosen.map(book=>({book,scope:OLD.includes(book)?"舊約":"新約",category:CATEGORIES.find(c=>c.books.includes(book))?.name||"其他"}));
  index=0;correct=0;wrong=[];answered=false;fiftyUsed=false;teacherUsed=false;bibleUsed=false;
  $("setup").classList.add("hidden");$("result").classList.add("hidden");$("quiz").classList.remove("hidden");
  const modeLabel=mode==="category"?"書卷分類配對":mode==="testament"?"分辨新舊約":"目錄順序填空";
  $("scope-label").textContent=(scope==="old"?"舊約":scope==="new"?"新約":"新舊約混合")+"・"+modeLabel;
  renderQuestion();
}
// 每次啟動題目都清除前一個計時器，避免多個倒數同時執行。
function stopTimer(){
  if(timerInterval !== null){clearInterval(timerInterval);timerInterval=null;}
}
function updateTimerDisplay(){
  const value=$("timer-value"), bar=$("timer-bar");
  if(value) value.textContent=String(timeLeft);
  if(bar){
    bar.style.width=`${Math.min(100,timeLeft/40*100)}%`;
    bar.classList.toggle("urgent",timeLeft<=10);
  }
}
function timerTick(){
  if(answered || $("quiz").classList.contains("hidden")){
    stopTimer();return;
  }
  // 根據實際經過的秒數扣除時間，避免背景分頁造成計時失準。
  const now=Date.now();
  timeLeft=Math.max(0,Math.ceil((timerDeadline-now)/1000));
  updateTimerDisplay();
  if(timeLeft===0){
    stopTimer();
    if(!answered && questions[index]){
      answered=true;
      const q=questions[index];
      const expected=lastMode==="category"?q.category:lastMode==="testament"?q.scope:q.book;
      wrong.push({book:q.book,answer:"時間到（未作答）",expected,mode:lastMode});
      nextQuestion();
    }
  }
}
function startTimer(){
  stopTimer();
  timeLeft=40;
  timerDeadline=Date.now()+40000;
  updateTimerDisplay();
  timerInterval=setInterval(timerTick,250);
}
function setHelpLabel(button, label, used){
  const copy=button.querySelector(".help-copy");
  copy.replaceChildren();
  const title=document.createElement("strong");
  title.textContent=label;
  copy.appendChild(title);
  if(used){
    const status=document.createElement("span");
    status.className="help-used-status";
    status.textContent="已使用";
    copy.appendChild(status);
  }
}
function renderQuestion(){
  stopTimer();
  answered=false;
  $("help-actions").classList.remove("hidden");
  $("fifty-btn").classList.toggle("hidden", lastMode==="testament");
  [["fifty-btn",fiftyUsed,"50/50"],["teacher-btn",teacherUsed,"問老師"],["bible-btn",bibleUsed,"翻聖經10秒"]].forEach(([id,used,label])=>{
    const btn=$(id);btn.disabled=used;btn.classList.toggle("used",used);
    setHelpLabel(btn, label, used);
  });
  $("help-feedback").classList.add("hidden"); $("help-feedback").textContent="";
  const q=questions[index], pool=q.scope==="舊約"?OLD:NEW;
  let opts=[];
  if(lastMode==="category"){
    $("question-hint").textContent="";
    $("question-title").textContent=`「${q.book}」屬於哪一類書卷？`;
    $("book-list").innerHTML=`<div class="category-prompt"><span class="category-book-icon">📖</span><span class="category-book-name">${q.book}</span><span class="category-book-sub">請選擇正確的分類</span></div>`;
    const categories=CATEGORIES.map(c=>c.name);
    opts=shuffle([q.category,...shuffle(categories.filter(c=>c!==q.category)).slice(0,3)]);
  }else if(lastMode==="testament"){
    $("question-hint").textContent="";
    $("question-title").textContent=`「${q.book}」屬於新約還是舊約？`;
    $("book-list").innerHTML=`<div class="category-prompt"><span class="category-book-icon">📖</span><span class="category-book-name">${q.book}</span><span class="category-book-sub">請選擇所屬約卷</span></div>`;
    opts=shuffle(["舊約","新約"]);
  }else{
    $("question-hint").textContent="請選出空格中正確的聖經書卷";
    $("question-title").textContent="以下目錄中，缺少的是哪一卷？";
    const pos=pool.indexOf(q.book);
    // 簡單與困難對調：簡單顯示上下各兩卷，普通顯示上下各一卷，困難只顯示上方一卷
    const beforeCount=lastDifficulty==="easy"?2:lastDifficulty==="normal"?1:1;
    const afterCount=lastDifficulty==="easy"?2:lastDifficulty==="normal"?1:0;
    const start=Math.max(0,pos-beforeCount);
    const end=Math.min(pool.length-1,pos+afterCount);
    const visibleBooks=[];
    for(let bookIndex=start;bookIndex<=end;bookIndex++){
      if(bookIndex===pos) visibleBooks.push(`<div class="book-item blank"><span class="num">${bookIndex+1}.</span><span>？　＿＿＿＿</span></div>`);
      else visibleBooks.push(`<div class="book-item"><span class="num">${bookIndex+1}.</span><span>${pool[bookIndex]}</span></div>`);
    }
    $("book-list").innerHTML=visibleBooks.join("");
    const difficultyNames={easy:"簡單",normal:"普通",hard:"困難"};
    $("question-hint").textContent="";
    opts=shuffle([q.book,...shuffle(pool.filter(b=>b!==q.book)).slice(0,3)]);
  }
  $("options").innerHTML=opts.map((b,i)=>`<button class="option" data-answer="${b}"><span class="letter">${"ABCD"[i]}</span>${b}</button>`).join("");
  $("options").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.answer)));
  $("progress-label").textContent=`第 ${index+1} / ${questions.length} 題`;
  $("feedback").className="feedback hidden";$("next-btn").classList.add("hidden");
  startTimer();
}
function useFiftyFifty(){
  if(fiftyUsed || answered || lastMode==="testament") return;
  const buttons=[...$("options").querySelectorAll("button")];
  const expected=lastMode==="category"?questions[index].category:questions[index].book;
  const wrongButtons=shuffle(buttons.filter(btn=>btn.dataset.answer!==expected));
  wrongButtons.slice(0,2).forEach(btn=>btn.remove());
  [...$("options").querySelectorAll("button")].forEach((option,i)=>{
    const letter=option.querySelector(".letter");
    if(letter) letter.textContent="ABCD"[i];
  });
  fiftyUsed=true;
  const btn=$("fifty-btn");btn.disabled=true;btn.classList.add("used");setHelpLabel(btn,"50/50",true);
}
function showHelpMessage(message){
  const el=$("help-feedback");el.textContent=message;el.classList.remove("hidden");
}
function askTeacher(){
  if(teacherUsed || answered) return;
  const q=questions[index];
  const category=CATEGORIES.find(c=>c.books.includes(q.book));
  const pos=(q.scope==="舊約"?OLD:NEW).indexOf(q.book)+1;
  if(lastMode==="order"){
    showHelpMessage(`老師提示：這卷書屬於「${category?.name||q.scope}」。在${q.scope}中排第 ${pos} 卷。`);
  }else if(lastMode==="category"){
    const clues={"摩西五經":"這類書卷記載律法與以色列民族的起源。","歷史書":"這類書卷主要記載以色列民族的歷史。","詩歌智慧書":"這類書卷包含詩歌、禱告及人生智慧。","大先知書":"這類書卷是篇幅較長的先知著作。","小先知書":"這類書卷是篇幅較短的先知著作。","四福音書":"這類書卷記載耶穌的生平與教導。","新約歷史書":"這類書卷記載初代教會的發展。","保羅書信":"這類書卷是保羅寫給教會或個人的書信。","一般書信":"這類書卷屬於其他使徒與信徒的書信。","預言書":"這類書卷主要記載末世異象與啟示。"};
    showHelpMessage(`老師提示：${clues[q.category]||"想想這卷書的內容與文體。"}`);
  }else if(lastMode==="testament"){
    // 分辨新舊約：問老師不顯示任何老師提示；其他模式維持原樣。
    $("help-feedback").textContent="";
    $("help-feedback").classList.add("hidden");
  }
  teacherUsed=true;const btn=$("teacher-btn");btn.disabled=true;btn.classList.add("used");setHelpLabel(btn,"問老師",true);
}
function useBibleTime(){
  if(bibleUsed || answered) return;
  timerDeadline+=10000;
  timerTick();
  bibleUsed=true;
  const btn=$("bible-btn");btn.disabled=true;btn.classList.add("used");setHelpLabel(btn,"翻聖經10秒",true);
  showHelpMessage("📖 已為你增加 10 秒，快把握時間查找！");
}
function choose(answer){
  if(answered)return;answered=true;stopTimer();
  const q=questions[index], expected=lastMode==="category"?q.category:lastMode==="testament"?q.scope:q.book, isCorrect=answer===expected;
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
  if(wrong.length){review.classList.remove("hidden");list.innerHTML=wrong.map((w,i)=>`<div class="wrong-row">${i+1}. ${w.mode==="category"?`書卷：${w.book}；正確分類：`:w.mode==="testament"?`書卷：${w.book}；所屬約卷：`:`正確答案：`}<strong>${w.expected||w.book}</strong>　你的答案：${w.answer}</div>`).join("");}
  else review.classList.add("hidden");
}
$("start-btn").addEventListener("click",()=>startQuiz($("scope").value,10,null,$("game-mode").value,$("difficulty").value));
$("next-btn").addEventListener("click",nextQuestion);
$("fifty-btn").addEventListener("click",useFiftyFifty);
$("teacher-btn").addEventListener("click",askTeacher);
$("bible-btn").addEventListener("click",useBibleTime);
$("quit-btn").addEventListener("click",()=>{if(confirm("確定要結束本回合嗎？目前成績將不會保留。")){stopTimer();$("quiz").classList.add("hidden");$("setup").classList.remove("hidden");}});
$("again-btn").addEventListener("click",()=>startQuiz(lastScope,lastCount,null,lastMode,lastDifficulty));
$("home-btn").addEventListener("click",()=>{$("result").classList.add("hidden");$("setup").classList.remove("hidden");});
$("retry-wrong-btn").addEventListener("click",()=>startQuiz(lastScope,wrong.length,wrong.map(w=>w.book),lastMode,lastDifficulty));

function updateDifficultyVisibility(){
  $("difficulty-setting").classList.toggle("hidden", $("game-mode").value !== "order");
}
$("game-mode").addEventListener("change", updateDifficultyVisibility);
updateDifficultyVisibility();

// 切換回頁面時依實際時間立即更新倒數。
document.addEventListener("visibilitychange",()=>{if(!document.hidden && timerInterval!==null)timerTick();});
