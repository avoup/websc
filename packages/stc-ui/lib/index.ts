export default class UI {
    private stc;
    private readonly listenParams;
    private containerElement;
    private startButton;
    private stopButton;
    private noiseProfileButton;
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
        this.noiseProfileButton.addEventListener('click', this.onAdjustNoise)

        document.body.appendChild(this.containerElement);
    }

    private createHtmlElements = () => {
        this.containerElement = document.createElement('div');
        this.containerElement.className = 'reset stc-center'

        this.startButton = document.createElement('button')
        this.startButton.className = 'reset stc-button stc-bg-blue';
        this.startButton.innerText = '▶';

        this.stopButton = document.createElement('button')
        this.stopButton.className = 'reset stc-button';
        this.stopButton.innerText = '■';

        this.noiseProfileButton = document.createElement('button');
        this.noiseProfileButton.className = 'reset stc-button stc-bg-blue';
        this.noiseProfileButton.innerText = '∿'

        this.predictionElement = document.createElement('div');
        this.predictionElement.className = 'reset stc-inline-block'

        this.micElement = document.createElement('div');
        this.micElement.className = 'reset stc-mic';

        this.micPulseElement = document.createElement('div');
        this.micPulseElement.className = 'reset stc-micPulse';

        this.micElement.appendChild(this.micPulseElement);

        this.containerElement.appendChild(this.startButton)
        this.containerElement.appendChild(this.stopButton)
        this.containerElement.appendChild(this.noiseProfileButton)
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
    position:fixed;
    z-index: 9999;
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
    animation: stc-pulsate infinite 1.5s;
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
        styleSheet?.insertRule(`.reset {
        animation : none;
    animation-delay : 0;
    animation-direction : normal;
    animation-duration : 0;
    animation-fill-mode : none;
    animation-iteration-count : 1;
    animation-name : none;
    animation-play-state : running;
    animation-timing-function : ease;
    backface-visibility : visible;
    background : 0;
    background-attachment : scroll;
    background-clip : border-box;
    background-color : transparent;
    background-image : none;
    background-origin : padding-box;
    background-position : 0 0;
    background-position-x : 0;
    background-position-y : 0;
    background-repeat : repeat;
    background-size : auto auto;
    border : 0;
    border-style : none;
    border-width : medium;
    border-color : inherit;
    border-bottom : 0;
    border-bottom-color : inherit;
    border-bottom-left-radius : 0;
    border-bottom-right-radius : 0;
    border-bottom-style : none;
    border-bottom-width : medium;
    border-collapse : separate;
    border-image : none;
    border-left : 0;
    border-left-color : inherit;
    border-left-style : none;
    border-left-width : medium;
    border-radius : 0;
    border-right : 0;
    border-right-color : inherit;
    border-right-style : none;
    border-right-width : medium;
    border-spacing : 0;
    border-top : 0;
    border-top-color : inherit;
    border-top-left-radius : 0;
    border-top-right-radius : 0;
    border-top-style : none;
    border-top-width : medium;
    bottom : auto;
    box-shadow : none;
    box-sizing : content-box;
    caption-side : top;
    clear : none;
    clip : auto;
    color : inherit;
    columns : auto;
    column-count : auto;
    column-fill : balance;
    column-gap : normal;
    column-rule : medium none currentColor;
    column-rule-color : currentColor;
    column-rule-style : none;
    column-rule-width : none;
    column-span : 1;
    column-width : auto;
    content : normal;
    counter-increment : none;
    counter-reset : none;
    cursor : auto;
    direction : ltr;
    display : inline;
    empty-cells : show;
    float : none;
    font : normal;
    font-family : inherit;
    font-size : medium;
    font-style : normal;
    font-variant : normal;
    font-weight : normal;
    height : auto;
    hyphens : none;
    left : auto;
    letter-spacing : normal;
    line-height : normal;
    list-style : none;
    list-style-image : none;
    list-style-position : outside;
    list-style-type : disc;
    margin : 0;
    margin-bottom : 0;
    margin-left : 0;
    margin-right : 0;
    margin-top : 0;
    max-height : none;
    max-width : none;
    min-height : 0;
    min-width : 0;
    opacity : 1;
    orphans : 0;
    outline : 0;
    outline-color : invert;
    outline-style : none;
    outline-width : medium;
    overflow : visible;
    overflow-x : visible;
    overflow-y : visible;
    padding : 0;
    padding-bottom : 0;
    padding-left : 0;
    padding-right : 0;
    padding-top : 0;
    page-break-after : auto;
    page-break-before : auto;
    page-break-inside : auto;
    perspective : none;
    perspective-origin : 50% 50%;
    position : static;
    /* May need to alter quotes for different locales (e.g fr) */
    quotes : '\\201C' '\\201D' '\\2018' '\\2019';
    right : auto;
    tab-size : 8;
    table-layout : auto;
    text-align : inherit;
    text-align-last : auto;
    text-decoration : none;
    text-decoration-color : inherit;
    text-decoration-line : none;
    text-decoration-style : solid;
    text-indent : 0;
    text-shadow : none;
    text-transform : none;
    top : auto;
    transform : none;
    transform-style : flat;
    transition : none;
    transition-delay : 0s;
    transition-duration : 0s;
    transition-property : none;
    transition-timing-function : ease;
    unicode-bidi : normal;
    vertical-align : baseline;
    visibility : visible;
    white-space : normal;
    widows : 0;
    width : auto;
    word-spacing : normal;
    z-index : auto;
    /* basic modern patch */
    all: initial;
    all: unset;}`)
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
        this.stc.addEventListener('onPrediction', this.onPrediction)
        this.stc.addEventListener('onNoise', this.onNoise);
        this.stc.addEventListener('onAdjustNoise', ({detail}) => {
            this.noiseProfileButton.classList.add('stc-bg-blue')
            console.log('noise: ', detail.data)
        })
    }

    private onStart = () => {
        this.micElement.classList.add('stc-bg-blue');
        this.startButton.classList.remove('stc-bg-blue')
        this.stopButton.classList.add('stc-bg-blue')

        this.stopButton.addEventListener('click', this.onStop, {once: true});
        this.stc.listen(this.listenParams)
    }

    private onAdjustNoise = () => {
        this.noiseProfileButton.classList.remove('stc-bg-blue');
        this.stc.adjustNoise();
    }

}
