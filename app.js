const OLD = ["創世記","出埃及記","利未記","民數記","申命記","約書亞記","士師記","路得記","撒母耳記上","撒母耳記下","列王紀上","列王紀下","歷代志上","歷代志下","以斯拉記","尼希米記","以斯帖記","約伯記","詩篇","箴言","傳道書","雅歌","以賽亞書","耶利米書","耶利米哀歌","以西結書","但以理書","何西阿書","約珥書","阿摩司書","俄巴底亞書","約拿書","彌迦書","那鴻書","哈巴谷書","西番雅書","哈該書","撒迦利亞書","瑪拉基書"];
const NEW = ["馬太福音","馬可福音","路加福音","約翰福音","使徒行傳","羅馬書","哥林多前書","哥林多後書","加拉太書","以弗所書","腓立比書","歌羅西書","帖撒羅尼迦前書","帖撒羅尼迦後書","提摩太前書","提摩太後書","提多書","腓利門書","希伯來書","雅各書","彼得前書","彼得後書","約翰一書","約翰二書","約翰三書","猶大書","啟示錄"];
const $ = id => document.getElementById(id);
let questions=[], index=0, correct=0, wrong=[], answered=false, lastScope="all", lastCount=20, lastClueMode="four";

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function poolFor(scope){return scope==="old"?OLD:scope==="new"?NEW:[...OLD,...NEW];}
function startQuiz(scope,count,onlyWrong=null,clueMode=null){
  lastScope=scope;lastCount=count;
  lastClueMode=clueMode||lastClueMode;
  const pool=poolFor(scope);
  const radius=lastClueMode==="four"?2:1;
  const eligible=pool.filter(book=>{
    const testament=OLD.includes(book)?OLD:NEW;
    const p=testament.indexOf(book);
    if(lastClueMode==="one-above") return p>=1;
    return p>=radius && p<testament.length-radius;
  });
  const chosen=onlyWrong?shuffle(onlyWrong):shuffle(eligible).slice(0,Math.min(count,eligible.length));
  questions=chosen.map(book=>({book,scope:OLD.includes(book)?"舊約":"新約"}));
  index=0;correct=0;wrong=[];answered=false;
  $("setup").classList.add("hidden");$("result").classList.add("hidden");$("quiz").classList.remove("hidden");
  $("scope-label").textContent=scope==="old"?"舊約抽考":scope==="new"?"新約抽考":"新舊約混合";
  renderQuestion();
}
function renderQuestion(){
  answered=false;
  const q=questions[index], pool=q.scope==="舊約"?OLD:NEW;
  const pos=pool.indexOf(q.book);
  let before=0, after=0;
  if(lastClueMode==="four"){before=2;after=2;}
  else if(lastClueMode==="two"){before=1;after=1;}
  else {before=1;after=0;}
  const start=pos-before;
  const segment=pool.slice(start,pos+after+1);
  const blankIndex=before;
  $("progress-label").textContent=`第 ${index+1} / ${questions.length} 題`;
  $("progress-bar").style.width=`${index/questions.length*100}%`;
  $("book-list").innerHTML=segment.map((b,i)=>`<div class="book-item ${i===blankIndex?"blank":""}"><span class="num">${start+i+1}.</span><span>${i===blankIndex?"？ ＿＿＿＿":b}</span></div>`).join("");
  const distractors=shuffle(pool.filter(b=>b!==q.book)).slice(0,3);
  const opts=shuffle([q.book,...distractors]);
  $("options").innerHTML=opts.map((b,i)=>`<button class="option" data-answer="${b}"><span class="letter">${"ABCD"[i]}</span>${b}</button>`).join("");
  $("options").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>choose(btn.dataset.answer)));
  $("feedback").className="feedback hidden";$("next-btn").classList.add("hidden");
}
function choose(answer){
  if(answered)return;answered=true;
  const q=questions[index], isCorrect=answer===q.book;
  if(isCorrect)correct++;else wrong.push({book:q.book,answer});
  $("options").querySelectorAll("button").forEach(btn=>{
    btn.disabled=true;
    if(btn.dataset.answer===q.book)btn.classList.add("correct");
    else if(btn.dataset.answer===answer)btn.classList.add("incorrect");
  });
  const fb=$("feedback");fb.className=`feedback ${isCorrect?"good":"bad"}`;
  fb.innerHTML=isCorrect?`<strong>答對了！太棒了！🎉</strong><br>正確答案是：${q.book}`:`<strong>再加油！</strong><br>你選擇了「${answer}」，正確答案是「${q.book}」。`;
  $("next-btn").textContent=index===questions.length-1?"查看成績 →":"下一題 →";
  $("next-btn").classList.remove("hidden");
}
function nextQuestion(){if(index<questions.length-1){index++;renderQuestion();}else showResult();}
function showResult(){
  $("quiz").classList.add("hidden");$("result").classList.remove("hidden");
  const total=questions.length, pct=Math.round(correct/total*100), score=Math.round(correct/total*100);
  $("score").textContent=score;$("correct-count").textContent=correct;$("wrong-count").textContent=wrong.length;$("accuracy").textContent=pct+"%";
  $("result-message").textContent=pct===100?"太厲害了！全部答對，已經熟悉這回合的目錄！":pct>=80?"表現很好！再練習幾次就能更加熟悉聖經目錄。":pct>=60?"做得不錯，看看錯題再挑戰一次吧！":"別氣餒，透過錯題重練會越來越熟悉！";
  const review=$("wrong-review"), list=$("wrong-list");
  if(wrong.length){review.classList.remove("hidden");list.innerHTML=wrong.map((w,i)=>`<div class="wrong-row">${i+1}. 正確答案：<strong>${w.book}</strong>　你的答案：${w.answer}</div>`).join("");}
  else review.classList.add("hidden");
}
$("start-btn").addEventListener("click",()=>startQuiz($("scope").value,Number($("question-count").value),null,$("clue-mode").value));
$("next-btn").addEventListener("click",nextQuestion);
$("quit-btn").addEventListener("click",()=>{if(confirm("確定要結束本回合嗎？目前成績將不會保留。")){$("quiz").classList.add("hidden");$("setup").classList.remove("hidden");}});
$("again-btn").addEventListener("click",()=>startQuiz(lastScope,lastCount,null,lastClueMode));
$("home-btn").addEventListener("click",()=>{$("result").classList.add("hidden");$("setup").classList.remove("hidden");});
$("retry-wrong-btn").addEventListener("click",()=>startQuiz(lastScope,wrong.length,wrong.map(w=>w.book),lastClueMode));
