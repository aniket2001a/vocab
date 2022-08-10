let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = "6afc4d47-cbd3-4725-ae9e-25222b2c2d43";
let apiKeyTh = "604df6c7-6b5f-42c4-b8bb-b1a62c6ec4db";
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    // alert(1);

    // clear prev data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    //Get input data
    let word = input.value;
    //call API get data
    if(word === ''){
        alert('Word is required');
        return;
    }

    getData(word);
})

async function getData(word){
    loading.style.display = 'block';
    // Ajax call
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const responseTh = await fetch(`https://dictionaryapi.com/api/v3/references/ithesaurus/json/${word}?key=${apiKeyTh}`)
    const data = await response.json();
    const dataTh = await responseTh.json();


    // if empty result
    if(!data.length){
        loading.style.display = 'none';
        notFound.innerText = 'No result found';
        return;
    }


    // if result is suggestions
    if(typeof data[0] === 'string'){
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        });
        return;
    }



    // Result found
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName){
        renderSound(soundName);
    }

    // demo
    // let itr = dataTh[0].meta.syns[0];
    // itr.forEach(ele => {
    //     let suggestion = document.createElement('span');
    //     suggestion.classList.add('suggested');
    //     suggestion.innerText = element;
    //     notFound.appendChild(suggestion);
    // });

    // thesaurus
    if(typeof dataTh[0] === 'string'){

        dataTh.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        });
    }

    // console.log(data);
    console.log(dataTh);
}


function renderSound(soundName){
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);

}