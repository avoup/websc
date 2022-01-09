import * as tf from '@tensorflow/tfjs'
import {loadGraphModel} from '@tensorflow/tfjs-converter';

const MODEL_URL = 'public/models/converted_model/model.json';
const WORDS = ['ზევით', 'უკან', 'მარცხნივ', 'ქვევით', 'მარჯვნივ', 'წინ'];

(async () => {
    const model = await loadGraphModel(MODEL_URL);
    const mic = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
    const context = new AudioContext({
        sampleRate: 16000,
    });

    const source = context.createMediaStreamSource(mic);
    const audioBuffer = context.createBuffer(1, 16000, 16000)
    const processor = context.createScriptProcessor(8192, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    let prevHalf;
    processor.onaudioprocess = async function ({inputBuffer}) {
        const channelData = audioBuffer.getChannelData(0);
        const audioData = inputBuffer.getChannelData(0);
        if (!prevHalf) return prevHalf = audioData;
        channelData.set(prevHalf.slice(192, 8192), 0);
        channelData.set(audioData.slice(0, 7808), 8000);

        const waveform = tf.tensor1d(channelData, 'float32');
        const stft = tf.signal.stft(waveform, 255, 128, 256);
        const cast = tf.abs(stft.cast('float32'));
        const spectrogram = tf.expandDims(tf.expandDims(cast, -1), 0)
        const ex = spectrogram.cast('float32')
        const pred = model.predict(ex)

        // @ts-ignore
        const arr: number[] = Array.from(pred.softmax().dataSync());

        let prediction;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > 0.5) {
                prediction = WORDS[i];
            }
        }
        console.log(arr.map(e => e.toFixed(3)))
        console.log(WORDS, prediction)

    };
})()
