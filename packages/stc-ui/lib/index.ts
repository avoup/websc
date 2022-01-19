export default class UI {
    private stc;
    private readonly listenParams;
    private containerElement;
    private startButton;
    private stopButton;
    private predictionElement;
    private micElement;
    private micPulseElement;

    constructor(stc, listenParams) {
        this.stc = stc;
        this.listenParams = listenParams;
        this.createHtmlElements();
        // set stylesheet
        this.injectCss();

        this.addStcListeners();
        // Set listeners
        this.startButton.addEventListener('click', this.onStart, {once: true});

        document.body.appendChild(this.containerElement);
    }

    private createHtmlElements = () => {
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'stc-center'

        this.startButton = document.createElement('button')
        this.startButton.className = 'stc-button stc-bg-blue';
        this.startButton.innerText = 'Start';

        this.stopButton = document.createElement('button')
        this.stopButton.className = 'stc-button';
        this.stopButton.innerText = 'Stop';

        this.predictionElement = document.createElement('div');
        this.predictionElement.className = 'stc-inline-block'

        this.micElement = document.createElement('div');
        this.micElement.className = 'stc-mic';

        this.micPulseElement = document.createElement('div');
        this.micPulseElement.className = 'stc-micPulse';

        this.micElement.appendChild(this.micPulseElement);

        this.containerElement.appendChild(this.startButton)
        this.containerElement.appendChild(this.stopButton)
        this.containerElement.appendChild(this.micElement)
        this.containerElement.appendChild(this.predictionElement)
    }

    private injectCss = () => {
        const style = document.createElement('style');
        document.head.appendChild(style);
        const styleSheet = style.sheet;
        styleSheet?.insertRule(`.stc-mic {
    margin: 0 10px 0 10px;
    border: none;
    padding: 0;
    border-radius: 100%;
    width: 25px;
    height: 25px;
    font-size: 3em;
    color: #fff;
    position: relative;
    z-index: 999;
    display: inline-block;
    line-height: 100px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    background: darkgray none;
    transition: background-color 0.2s linear;
}`)
        styleSheet?.insertRule(`.stc-button {
    background-color: #c1c1c1;
    border: none;
    color: white;
    padding: 4px 26px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    transition: background-color 0.2s linear;
}`)
        styleSheet?.insertRule(`.stc-center {
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    margin: auto;
    width: 500px;
    border: 1px solid #adadad;
    background: #f3f3f3;
    padding: 5px 3px 5px 3px;
    border-radius: 0 0 4px 4px;
    box-shadow: 1px 1px 4px #c1c1c1;
}`)
        styleSheet?.insertRule(`.stc-inline-block {
    display: inline-block;
}`)
        styleSheet?.insertRule(`.stc-bg-red {
    background: red!important;
}`)
        styleSheet?.insertRule(`.stc-bg-blue {
    background: #189BFF!important;
}`)
        styleSheet?.insertRule(`.stc-pulse-ring {
    content: '';
    width: 27px;
    height: 27px;
    background: transparent;
    border: 3px solid red;
    border-radius: 50%;
    position: absolute;
    top: -4px;
    left: -4px;
    animation: pulsate infinite 1.5s;
}`)
        styleSheet?.insertRule(`.stc-pulse-ring.delay{
// animation-delay: 1s;
}`)
        styleSheet?.insertRule(`@-webkit-keyframes stc-pulsate {
            0% {
                -webkit-transform: scale(1, 1);
                opacity: 1;
            }
            100% {
                -webkit-transform: scale(1.3, 1.3);
                opacity: 0;
            }
        }`)

    }

    private onPrediction = ({detail}) => {
        this.predictionElement.innerText = `${detail.predictedWord} ${detail.precision || ''}`
    }

    private onNoise = ({detail}) => {
        if (detail.noise) {
            this.micElement.classList.add('stc-bg-red')
            this.micElement.classList.remove('stc-bg-blue')
            this.micPulseElement.classList.add('stc-pulse-ring')
        } else {
            this.micElement.classList.remove('stc-bg-red')
            this.micElement.classList.add('stc-bg-blue')
            this.micPulseElement.classList.remove('stc-pulse-ring')
        }
    }

    private onStop = () => {
        this.startButton.classList.add('stc-bg-blue');
        this.stopButton.classList.remove('stc-bg-blue');
        this.micPulseElement.classList.remove('stc-pulse-ring');
        this.micElement.classList.remove('stc-bg-blue');
        this.micElement.classList.remove('stc-bg-red');
        this.stc.stop();
        this.startButton.addEventListener('click', this.onStart, {once: true});
    }

    private addStcListeners = () => {
        this.stc.addEventListener('predict', this.onPrediction)
        this.stc.addEventListener('noise', this.onNoise);
    }

    private onStart = () => {
        this.micElement.classList.add('stc-bg-blue');
        this.startButton.classList.remove('stc-bg-blue')
        this.stopButton.classList.add('stc-bg-blue')

        this.stopButton.addEventListener('click', this.onStop, {once: true});
        this.stc.listen(this.listenParams)
    }

}
