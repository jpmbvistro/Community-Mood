Array.from(document.querySelectorAll('.vibe-select')).forEach((item, i)=>{
  item.addEventListener('click', event => {
    fetch('vibe', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        vibe: item.id
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      let vibeImg = document.querySelector('.vibeDisplay img')
      vibeImg.classList.remove('hide')
      vibeImg.src = data.isChill ? 'img/chill.png' : 'img/notChill.png'
      vibeImg.alt = data.isChill ? "We're all chill" : "Things could be better"
      document.querySelector('.display').classList.add('vibe')
      document.querySelector('.response').innerText = data.isChill ? 'Sweet' : 'Meh'
      document.querySelector('.response-detail').innerText = data.isChill ? 'everyone is doing pretty well' : "folx aren't feeling great"
      document.querySelector('.display.vibe').style.background = data.isChill ? 'linear-gradient(40deg, rgb(255, 232, 207) 60%, rgb(255, 185, 195))' : 'linear-gradient(40deg, rgb(201, 201, 201) 60%, rgb(255, 185, 195))'
    })
    document.querySelectorAll('.vibe-select').forEach((jtem, j) =>{
      jtem.style.transition = `all .1s ${Math.abs(Number(jtem.id)-Number(item.id))*.1}s ease-out, opacity .2s ${Math.abs(Number(jtem.id)-Number(item.id))*.1}s ease`
      jtem.disabled=true
    })
  })
})

document.querySelector('.menu2').addEventListener('click',element=>{
  element.currentTarget.classList.toggle('press')
})

/**
Aside panel functionality
**/
document.querySelector('.info-button').addEventListener('click', toggleAside)
document.querySelector('#hide-aside').addEventListener('click', toggleAside)

function toggleAside(){       document.querySelector('aside').classList.toggle('reveal')
}
/**
Aside Panel end
*/
