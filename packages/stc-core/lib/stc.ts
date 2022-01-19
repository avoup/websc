import * as tf from "@tensorflow/tfjs";
import {loadGraphModel} from '@tensorflow/tfjs-converter';

class STC extends EventTarget {
    private userMedia;
    private model;
    private classes: String[] = [];
    private processor;
    private hasSound: boolean = false;

    constructor() {
        super();
    }

    private getSpectrogram = function(dataBuffer) {
        const waveform = tf.tensor1d(dataBuffer, 'float32');
        const stft = tf.signal.stft(waveform, 255, 128, 256);
        const cast = tf.abs(stft.cast('float32'));
        const spectrogram = tf.expandDims(tf.expandDims(cast, -1), 0)
        return spectrogram.cast('float32')
    }

    private getMaxIndex = function(prediction, threshold) {
        const arr: number[] = Array.from(prediction.softmax().dataSync());

        let index: number | null = null;
        let precision: number | null = null;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > threshold && arr[i] >= arr[index || 0]) {
                index = i;
                precision = arr[i]
            }
        }
        return {index, precision}
    }

    private isSilent = function(waveform, threshold) {
        for (let i = 0; i < waveform.length; i++) {
            const abs = Math.abs(waveform[i])

            if (abs > threshold) {
                return false;
            }
        }
        return true;
    }

    private onStream = (stream, options, cb) => {
        const context = new AudioContext({sampleRate: 16000});

        let source;
        if (options.type === 'element')
            source = context.createMediaElementSource(<HTMLMediaElement>stream);
        else
            source = context.createMediaStreamSource(<MediaStream>stream);
        this.processor = context.createScriptProcessor(1024, 1, 1);

        source.connect(this.processor);
        this.processor.connect(context.destination);

        const audioBuffer = context.createBuffer(1, 16000, 16000)

        let hasStarted = false;
        let lastIndex = 1024;

        this.processor.onaudioprocess = async ({inputBuffer}) => {
            const currentData = inputBuffer.getChannelData(0);
            const resultData = audioBuffer.getChannelData(0);
            const silent = this.isSilent(currentData, 0.02);

            if (silent && !hasStarted) {
                this.soundDetected(false)
                resultData.set(currentData, 0);
                lastIndex = 0;
                return;
            } else {
                this.soundDetected(true)
                hasStarted = true;
            }

            resultData.set(currentData, lastIndex);
            lastIndex += 1024;
            if (lastIndex > 15000 || resultData.length < 15000) {
                console.log('running detection')
                lastIndex = 0;
                hasStarted = false;
                cb(resultData);
                if (options.type === 'element') this.processor.disconnect();
            }

        };
    }

    private handleStream = (stream: HTMLAudioElement | MediaStream, options: any) => {
        return new Promise((resolve) => this.onStream(stream, options, resolve));
    }

    private handleStreamSync = (stream, options, cb) => this.onStream(stream, options, cb);

    public loadModel = async (url, classes) => {
        if (this.model) return;
        this.classes = classes;
        try {
            this.model = await loadGraphModel(url)
        } catch (err) {
            throw(new Error('Error loading model'));
        }
    }

    public predictFromFile = async (file) => {
        if (!file) throw new Error('No file provided');
        // @ts-ignore
        if (file.touched) return
        // @ts-ignore
        file.touched = true;

        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.play(); // do not await (will lose first 1024 hz)

        const data = await this.handleStream(audio, {type: 'element'})
        const prediction = this.model.predict(this.getSpectrogram(data))

        const {index: result, precision} = this.getMaxIndex(prediction, 0.6)
        let predictedWord = this.classes[result ?? this.classes.length - 1]

        this.emit('predict', {predictedWord, precision})

        URL.revokeObjectURL(file);
        audio.remove();
    }

    public listen = async (params?) => {
        this.userMedia = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleSize: 16,
                channelCount: 1,
                // noiseSuppression: true
            },
            video: false
        })
        this.handleStreamSync(this.userMedia, {type: 'stream', noiseDetection: true}, (data) => {
            const prediction = this.model.predict(this.getSpectrogram(data))
            const {index: result, precision} = this.getMaxIndex(prediction, params.threshold ?? 0.58)
            let predictedWord = this.classes[result ?? this.classes.length - 1];

            this.emit('predict', {predictedWord, precision})
        });
    }

    private soundDetected = (detected) => {
        if (this.hasSound === detected) return;
        this.hasSound = detected;
        this.emit('noise', {noise: detected});
    }

    private emit = (eventName, data?) => {
        this.dispatchEvent(new CustomEvent(eventName, {detail: {...data}}))
    }

    public stop = async () => {
        this.userMedia.getTracks().forEach(track => track.stop());
        this.processor.disconnect();
    }
}

export default STC;
