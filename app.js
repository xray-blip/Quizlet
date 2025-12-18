// ----- tiny flashcard engine -----
const STORAGE_KEY = 'flashDecks';
let decks = JSON.parse(localStorage.getItem(STORAGE_KEY))||{};
let activeDeck = null, index = 0, shuffled = [];

const qs=id=>document.getElementById(id);
const show=(id)=>qs(id).hidden=false;
const hide=(id)=>qs(id).hidden=true;

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(decks));}
function randShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function renderDeckList(){
  const ul=qs('deckList'); ul.innerHTML='';
  Object.entries(decks).forEach(([name,cards])=>{
    const li=document.createElement('li');
    li.innerHTML=`<span>${name} (${cards.length})</span>
      <span>
        <button onclick="studyDeck('${name}')">Study</button>
        <button onclick="editDeck('${name}')">Edit</button>
        <button onclick="deleteDeck('${name}')">Del</button>
      </span>`;
    ul.appendChild(li);
  });
}
window.studyDeck=name=>{activeDeck=name;index=0;shuffled=randShuffle([...decks[name]]);show('studyArea');hide('deckPicker');hide('editor');renderCard();};
window.editDeck=name=>{activeDeck=name;show('editor');hide('deckPicker');hide('studyArea');qs('deckName').value=name;buildEditor(name);};
window.deleteDeck=name=>{if(confirm('Delete '+name+'?')){delete decks[name];save();renderDeckList();}};

function renderCard(){
  const card=shuffled[index];
  qs('curr').textContent=index+1; qs('total').textContent=shuffled.length;
  qs('.front').textContent=card.q; qs('.back').textContent=card.a;
  qs('.front').hidden=false; qs('.back').hidden=true;
}
qs('flipBtn').onclick=()=>{qs('.front').hidden=!qs('.front').hidden; qs('.back').hidden=!qs('.back').hidden);};
qs('nextBtn').onclick=()=>{index=(index+1)%shuffled.length;renderCard();};
qs('prevBtn').onclick=()=>{index=(index-1+shuffled.length)%shuffled.length;renderCard();};
qs('shuffleBtn').onclick=()=>{shuffled=randShuffle([...decks[activeDeck]]);index=0;renderCard();};
qs('backBtn').onclick=()=>{show('deckPicker');hide('studyArea');};

qs('newDeckBtn').onclick=()=>{activeDeck=null;qs('deckName').value='';buildEditor();show('editor');hide('deckPicker');hide('studyArea');};
function buildEditor(name){
  const cont=qs('cardRows'); cont.innerHTML='';
  const cards=name?decks[name]:[];
  cards.forEach((c,i)=>{
    const row=document.createElement('div');
    row.innerHTML=`<input placeholder="Question" value="${c.q}"><input placeholder="Answer" value="${c.a}">`;
    cont.appendChild(row);
  });
  if(!cards.length) addRow();
}
function addRow(){
  const row=document.createElement('div');
  row.innerHTML='<input placeholder="Question"><input placeholder="Answer">';
  qs('cardRows').appendChild(row);
}
qs('addCardBtn').onclick=addRow;
qs('saveDeckBtn').onclick=()=>{
  const name=qs('deckName').value.trim(); if(!name)return alert('Name?');
  const rows=[...qs('cardRows').children].map(div=>{
    const [q,a]=[...div.querySelectorAll('input')].map(i=>i.value.trim());
    return q&&a?{q,a}:null;
  }).filter(Boolean);
  if(!rows.length)return alert('Add cards first.');
  decks[name]=rows; save(); renderDeckList(); show('deckPicker'); hide('editor');
};
qs('cancelEditBtn').onclick=()=>{show('deckPicker');hide('editor');};

renderDeckList();
