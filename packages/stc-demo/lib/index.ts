// @ts-ignore
const STC = window.stc.STC;
// @ts-ignore
const classes = window.stc.classes;

const MODEL_URL = 'public/model/model.json';
const startListenButton = document.getElementById('startListen')!;
const stopListenButton = document.getElementById('stopListen')!;
const statusElement = document.getElementById('status')!;
const predictionElement = document.getElementById('prediction')!;

const fileInput = document.getElementById('fileInput')!;
const predictButton = document.getElementById('predictFiles')!;
const resetButton = document.getElementById('resetFiles')!;
const wordToPredictInput = document.getElementById('wordToPredict')!;

const runInference = async () => {
    const stc = new STC();
    await stc.loadModel(MODEL_URL, classes);
    await stc.listen({threshold: 0.58})
    stc.addEventListener('predict', ({detail}) => {
        predictionElement.innerText = `${detail.predictedWord} ${detail.precision}`
        console.log('predicted', detail.predictedWord, detail.precision);
    })
    stc.addEventListener('noise', ({detail}) => {
        if (detail.noise) {
            statusElement.innerText = 'Sound detected';
        } else {
            statusElement.innerText = 'Silence'
        }
    });
    stopListenButton.addEventListener('click', () => {
        stc.stop();
    }, {once: true});
}

startListenButton.addEventListener('click', runInference, {once: true});

const predictFromFile = async () => {
    const stc = new STC()
    await stc.loadModel(MODEL_URL, classes);

    // @ts-ignore
    stc.addEventListener('predict', ({detail}) => {
        console.log('prediction', detail.predictedWord, detail.precision)
    })

    const audioContainer = document.getElementById('filePredictions')!;

    let fileList = [];
    fileInput.addEventListener('change', (e) => {
        // @ts-ignore
        fileList = [...fileList, ...e.target?.files]
    })

    resetButton.addEventListener('click', () => {
        fileList = [];
        // @ts-ignore
        fileInput.value = ''
    })

    predictButton.addEventListener('click', async () => {
        // @ts-ignore
        const wordToPredict = wordToPredictInput.value
        if (fileList.length)
            for (let i = 0; i < fileList.length; i++) {
                await stc.predictFromFile(fileList[i])
            }
    })
}

predictFromFile();
