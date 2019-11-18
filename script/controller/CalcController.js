class CalcController {

    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperation = '';
        this._lastNumber = '';


        this._operation = [];
        this._locate = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeyBoard();
        this.pasteFromClipboard();
    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text);

        });
    }

    copToClipboard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();


    }


    initialize() {


        this.setDisplatDateTime();

        setInterval(() => {

            this.setDisplatDateTime();

        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });
        });
    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio() {

        if (this._audioOnOff) {
            this._audio.currentTimer = 0;
            this._audio.play();
        }


    }

    initKeyBoard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':

                    this.addOperation(parseInt(e.key));
                    break;
            }

        })


    }



    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperation = '';

        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }


    isOperation(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

            console.log(this._operation);

        }

    }


    getResult() {
        try {
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    
    
    }

    calc() {

        let last = '';
        this._lastOperation = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperation, this._lastNumber];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult()

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }


        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];


        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperation = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperation(this._operation[i]) == isOperation) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {

            lastItem = (isOperation) ? this._lastOperation : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperation(value)) {

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperation(value)) {

                this.pushOperation(value);

            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }
        }

    }

    setError() {
        this.displayCalc = "Error";
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperation(lastOperation) || !lastOperation) {

            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value) {

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(parseInt(value));
                break;


            default:
                this.setError();
                break;
        }

    }


    initButtonsEvent() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g ");

        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "click drag ", e => {

                let textbtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textbtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";
            });
        })
    }




    setDisplatDateTime() {
        this.displayDate = this.curentDate.toLocaleDateString(this._locate, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.displaytTime = this.curentDate.toLocaleTimeString(this._locate)

    }

    get displaytTime() {
        return this._timeEl.innerHTML;
    }

    set displaytTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }



    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value
    }

    get curentDate() {
        return new Date();
    }

    set dataAtual(value) {
        this._currentDate = value;

    }
}