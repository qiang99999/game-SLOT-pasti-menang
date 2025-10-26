
// Simple frontend logic for Qiang99 Slot (demo only)

function $(s){return document.querySelector(s)}
function $all(s){return document.querySelectorAll(s)}

let balanceEl = $('#balance')
let estimateEl = $('#estimate')
let balance = 100

function updateUI(){
  balanceEl.textContent = balance
  estimateEl.textContent = Math.round(balance * 0.1)
}

document.getElementById('clickCoinBtn').addEventListener('click', ()=>{
  balance += 1
  updateUI()
  showTempMessage('spinResult', 'Kamu mendapatkan +1 coin!')
})

function showTempMessage(id, text, timeout=1800){
  const el = document.getElementById(id)
  el.textContent = text
  setTimeout(()=> el.textContent = '', timeout)
}

// Spin logic
document.getElementById('spinBtn').addEventListener('click', ()=>{
  const cost = 10
  if(balance < cost){ showTempMessage('spinResult', 'Saldo tidak cukup untuk spin.'); return; }
  balance -= cost
  updateUI()
  // prizes array = some coins multiples
  const prizes = [0, 5, 10, 20, 50, 100]
  // weight the prizes (more chance small prizes)
  const weights = [30, 25, 20, 15, 8, 2]
  const total = weights.reduce((a,b)=>a+b,0)
  let r = Math.floor(Math.random()*total)
  let idx = 0
  while(r >= weights[idx]){ r -= weights[idx]; idx++ }
  const prize = prizes[idx]
  if(prize > 0){
    balance += prize
    updateUI()
    showTempMessage('spinResult', 'Berhasil! Kamu menang ' + prize + ' coins.')
  } else {
    showTempMessage('spinResult', 'Maaf, tidak dapat hadiah kali ini.')
  }
})

// Referral code copy
const refInput = $('#refCode')
const copyBtn = $('#copyRef')
const generated = Math.random().toString(36).slice(2,8).toUpperCase()
refInput.value = 'QIANG99-' + generated
copyBtn.addEventListener('click', ()=>{
  navigator.clipboard.writeText(refInput.value).then(()=>{
    alert('Referral code disalin: ' + refInput.value)
  }).catch(()=>{ alert('Gagal menyalin, silakan salin manual: ' + refInput.value) })
})

// Payout form (demo)
document.getElementById('payoutForm').addEventListener('submit', (e)=>{
  e.preventDefault()
  const bank = $('#bank').value.trim()
  const accountName = $('#accountName').value.trim()
  const accountNumber = $('#accountNumber').value.trim()
  const amount = Number($('#amount').value)
  const msgEl = $('#payoutMessage')
  if(!bank || !accountName || !accountNumber || !amount){ msgEl.textContent = 'Semua field wajib diisi.'; return; }
  if(amount <= 0 || Number.isNaN(amount)){ msgEl.textContent = 'Jumlah harus angka positif.'; return; }
  if(amount > balance){ msgEl.textContent = 'Saldo tidak cukup.'; return; }
  if(!/^\d{6,20}$/.test(accountNumber)){ msgEl.textContent = 'Nomor rekening tampak tidak valid (6-20 digit).'; return; }
  // simulate success
  balance -= amount
  updateUI()
  msgEl.textContent = 'Permintaan pencairan berhasil diajukan (demo).'
})

// helper
updateUI()
