import {useEffect, useRef} from 'react';
import './App.css';
import {Memory} from './Memory.jsx';

export default function App() {
    const ref = useRef(null);

    let out;

    useEffect(() => {

        out = ref.current;

    }, []);


    let a = '';
    let b = '';
    let sign = '';
    let finish = false;
    let showOperator = '';
    let memory = new Memory();

    function clearAll() {
        a = '';
        b = '';
        sign = '';
        finish = false;
        out.textContent = '0';
    }

    const x2ClickHandler = () => {
        let res = out.textContent * out.textContent;
        out.textContent = res;
        a = res;
        finish = true;
    };

    const x3ClickHandler = () => {
        let res = out.textContent * out.textContent * out.textContent;
        out.textContent = res;
        a = res;
        finish = true;
    };

    const tenXClickHandler = () => {
        let res = 1;
        for (let i = 0; i < out.textContent; i++) {
            res = res + "0";
        }
        out.textContent = res;
        a = res;
        finish = true;
    };

    const oneDivideXClickHandler = () => {
        if (out.textContent === '0') {
            clearAll();
            out.textContent = '/ by zero!';
            return;
        }
        let res = 1 / out.textContent;
        out.textContent = res;
        a = res;
        finish = true;
    };

    function factorial(x) {
        if (x === 0 || x === 1) {
            return 1;
        }
        return x * factorial(x - 1);
    }

    const factorialClickHandler = () => {
        const res = factorial(out.textContent);
        out.textContent = res;
        a = res;
        finish = true;
    };

    const signChangeClickHandler = () => {
        const res = out.textContent > 0 ? "-" + out.textContent
            : out.textContent < 0 ? out.textContent.substring(1) : out.textContent;
        out.textContent = res;
        a = res;
        finish = true;
    };

    const percentClickHandler = () => {
        if (sign === "+" || sign === "-") {
            b = a * b / 100;
        } else {
            b = b / 100;
        }

        fireEqual();
    };

    function fireEqual() {
        const equal = document.querySelector('.equal');
        const event = new Event("click", {bubbles: true});
        equal.dispatchEvent(event);
    }

    const sqrtClickHandler = () => {
        const num = out.textContent;
        let root = num / 2;
        const eps = 0.01;
        while (root - num / root > eps) {
            root = 0.5 * (root + num / root);
        }
        out.textContent = root;
        a = root;
        finish = true;

    };

    function mabs(x) {
        return (x < 0) ? -x : x;
    }

    function rootNDegree(num, rootDegree) {
        const eps = 0.00001;
        let root = num / rootDegree;
        let rn = num;
        while (mabs(root - rn) >= eps) {
            rn = num;
            for (let i = 1; i < rootDegree; i++) {
                rn = rn / root;
            }
            root = 0.5 * (rn + root);
        }
        return root;
    }

    const cbrtClickHandler = () => {
        const num = out.textContent;
        let root = rootNDegree(num, 3);
        out.textContent = root;
        a = root;
        finish = true;
    };

    const mcClickHandler = () => memory.clearMemory();

    const mrClickHandler = () => {
        const memoryValue = memory.recoverMemory();
        out.textContent = memoryValue;
        a = memoryValue;
        finish = true;
    };

    const mPlusClickHandler = () => memory.addToMemory(out.textContent);

    const mMinusClickHandler = () => memory.removeFromMemory(out.textContent);

    const buttonsClickHandler = (event) => {
        if (event.target.id === 'ac') return clearAll();
        const isDigit = event.target.classList.contains('digit');
        const isOperator = event.target.classList.contains('operator');
        const isEqual = event.target.classList.contains('equal');
        if (!isDigit && !isOperator && !isEqual) return;

        // out.textContent = '';

        const key = event.target.textContent;

        if (isDigit) {
            if (key === '.' && out.textContent.includes('.') && !finish) return;

            // if (finish && b === '') {
            //     finish = false;
            //     // clearAll();
            //     // a = key;
            // }

            if (b === '' && sign === '') {
                a += key;
                out.textContent = a;
            } else if (a !== '' && sign !== '' && finish) {
                b = key;
                out.textContent = b;
            } else {
                b += key;
                out.textContent = b;
            }
            return;
        }

        if (isOperator) {

            if (b !== '') {
                showOperator = key;
                out.textContent = key;
                fireEqual();
            }
            else {
                sign = key;
                out.textContent = sign;
            }
            return;
        }

        if (isEqual) {
            // if (b === '') b = a;
            let res;
            switch (sign) {
                case "+":
                    a = (+a) + (+b);
                    break;

                case "-":
                    a = a - b;
                    break;

                case "x":
                    a = a * b;
                    break;

                case "/":
                    if (b === '0') {
                        clearAll();
                        out.textContent = '/ by zero!';
                        return;
                    }
                    a = a / b;
                    break;
                case "xy":
                    res = a;
                    for (let i = 1; i < b; i++) {
                        res *= a;
                    }
                    a = res;
                    break;
                case "y√x":
                    let root = rootNDegree(a, b);
                    out.textContent = root;
                    a = root;
                    break;
            }
            b = '';
            if (showOperator !== '') {
                out.textContent = showOperator;
                sign = showOperator;
                showOperator = '';
            }
            else {
                finish = true;
                out.textContent = a;
            }

        }
    };

    return (
        <div className="calc">
            <div className="calc-screen">
                <p ref={ref}>0</p>
            </div>
            <div className="buttons" onClick={buttonsClickHandler}>
                <div className="btn bg-red" id="ac">AC</div>
                <div className="btn bg-gray" onClick={mcClickHandler}>MC</div>
                <div className="btn bg-gray" onClick={mrClickHandler}>MR</div>
                <div className="btn bg-gray" onClick={mPlusClickHandler}>M+</div>
                <div className="btn bg-gray" onClick={mMinusClickHandler}>M-</div>
                <div className="btn operator bg-orange">/</div>

                <div className="btn bg-gray" onClick={x2ClickHandler}>x<sup>2</sup></div>
                <div className="btn bg-gray" onClick={sqrtClickHandler}>&radic;</div>
                <div className="btn bg-gray" onClick={factorialClickHandler}>x!</div>
                <div className="btn bg-gray" onClick={signChangeClickHandler}>+/-</div>
                <div className="btn bg-gray" onClick={percentClickHandler}>%</div>
                <div className="btn operator bg-orange">x</div>

                <div className="btn x3 bg-gray" onClick={x3ClickHandler}>x<sup>3</sup></div>
                <div className="btn bg-gray" onClick={cbrtClickHandler}>&#8731;</div>
                <div className="btn digit">7</div>
                <div className="btn digit">8</div>
                <div className="btn digit">9</div>
                <div className="btn operator bg-orange">-</div>

                <div className="btn operator bg-gray" id="xy">x<sup>y</sup></div>
                <div className="btn operator bg-gray"><sup>y</sup>&radic;x</div>
                <div className="btn digit">4</div>
                <div className="btn digit">5</div>
                <div className="btn digit">6</div>
                <div className="btn operator bg-orange">+</div>

                <div className="btn bg-gray" onClick={tenXClickHandler}>10<sup>x</sup></div>
                <div className="btn bg-gray" onClick={oneDivideXClickHandler}>1/x</div>
                <div className="btn digit">1</div>
                <div className="btn digit">2</div>
                <div className="btn digit">3</div>
                <div className="btn equal bg-orange">=</div>

                <div className="btn func bg-gray">fn</div>
                <div className="btn func bg-gray">fn</div>
                <div className="btn digit zero">0</div>
                <div className="btn digit dot">.</div>
            </div>
        </div>
    );
}
