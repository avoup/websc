// @ts-ignore
const STC = window.stc.STC;
// @ts-ignore
const classes = window.stc.classes;
const MODEL_URL = 'public/model/model.json';

const startListenButton = document.getElementById('startListen')!;
const stopListenButton = document.getElementById('stopListen')!;

const predictionElement = document.getElementById('prediction')!;
const micElement = document.getElementById('mic')!;
const micPulseElement = document.getElementById('micPulse')!;

const runInference = async () => {
    const stc = new STC();
    await stc.loadModel(MODEL_URL, classes);
    await stc.listen({threshold: 0.58})

    micElement.classList.add('bg-blue');
    startListenButton.classList.remove('bg-blue')
    stopListenButton.classList.add('bg-blue')
    stc.addEventListener('predict', ({detail}) => {
        predictionElement.innerText = `${detail.predictedWord} ${detail.precision || ''}`
        // console.log('predicted', detail.predictedWord, detail.precision);
    })
    stc.addEventListener('noise', ({detail}) => {
        if (detail.noise) {
            micElement.classList.add('bg-red')
            micElement.classList.remove('bg-blue')
            micPulseElement.classList.add('pulse-ring')
        } else {
            micElement.classList.remove('bg-red')
            micElement.classList.add('bg-blue')
            micPulseElement.classList.remove('pulse-ring')
        }
    });
    stopListenButton.addEventListener('click', () => {
        startListenButton.classList.add('bg-blue')
        startListenButton.classList.remove('bg-blue')
        micPulseElement.classList.remove('pulse-ring')
        micElement.classList.remove('bg-blue');
        micElement.classList.remove('bg-red');
        stc.stop();
    }, {once: true});
}

startListenButton.addEventListener('click', runInference, {once: true});
