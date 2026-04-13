const display = document.getElementById("display");
const historyPanel = document.getElementById("history");
const historyToggle = document.getElementById("btn-history");
const taxRateInput = document.getElementById("tax-rate");
const btnTaxInclude = document.getElementById("btn-tax-include");
const btnTaxExclude = document.getElementById("btn-tax-exclude");
const btnDivmod = document.getElementById("btn-divmod");

const HISTORY_LIMIT = 10;
const calcHistory = [];

const setDisplay = v => { display.value = v; };
const appendDisplay = s => { display.value += s; };



//=======================================================
// 履歴機能
//=======================================================
const renderHistory = () => {
    historyPanel.replaceChildren();
    if (calcHistory.length === 0) {
        const p = document.createElement("p");
        p.className = "empty";
        p.textContent = "履歴はありません";
        historyPanel.appendChild(p);
        return;
    }
    const ol = document.createElement("ol");
    for (const { expr, result } of calcHistory) {
        const li = document.createElement("li");
        li.textContent = `${expr} = ${result}`;
        li.className = "history-item";
        li.addEventListener("click", () => {
            setDisplay(expr);
            historyPanel.hidden = true;
        });
        ol.appendChild(li);
    }
    historyPanel.appendChild(ol);
};

const pushHistory = (expr, result) => {
    calcHistory.unshift({ expr, result });
    if (calcHistory.length > HISTORY_LIMIT) calcHistory.length = HISTORY_LIMIT;
    if (!historyPanel.hidden) renderHistory();
};



//=======================================================
// 数式の評価
//=======================================================
const MAX_EXPR_LENGTH = 100;

const toMathExpr = expr => expr.replaceAll("×", "*");

const evaluateNumber = expr => {
    if (expr.length > MAX_EXPR_LENGTH) throw new Error("Expression too long");
    const result = Number(math.evaluate(toMathExpr(expr)));
    if (!Number.isFinite(result)) throw new Error("Invalid result");
    return result;
};

const getTaxRate = () => {
    const v = parseFloat(taxRateInput.value);
    return Number.isFinite(v) && v >= 0 ? v : 0;
};

const runWithErrorFallback = fn => {
    const original = display.value;
    try {
        fn(original);
    } catch {
        setDisplay("Error");
    }
};



//=======================================================
// 特殊ボタンの処理
//=======================================================
const specialHandlers = {
    'btn-clear': () => setDisplay(""),
    'btn-backspace': () => setDisplay(display.value.slice(0, -1)),
    'btn-equals': () => runWithErrorFallback(original => {
        const result = String(evaluateNumber(original));
        setDisplay(result);
        pushHistory(original, result);
    }),
};



//=======================================================
// 通常ボタンの処理
//=======================================================
document.querySelectorAll("button[data-testid]").forEach(btn => {
    const id = btn.dataset.testid;
    const handler = specialHandlers[id] ?? (() => appendDisplay(btn.textContent));
    btn.addEventListener("click", handler);
});

historyToggle.addEventListener("click", () => {
    historyPanel.hidden = !historyPanel.hidden;
    if (!historyPanel.hidden) renderHistory();
});

btnTaxInclude.addEventListener("click", () => runWithErrorFallback(original => {
    const base = evaluateNumber(original);
    const rate = getTaxRate();
    const result = String(Math.round(base * (1 + rate / 100) * 100) / 100);
    setDisplay(result);
    pushHistory(`${original} 税込(${rate}%)`, result);
}));

btnTaxExclude.addEventListener("click", () => runWithErrorFallback(original => {
    const withTax = evaluateNumber(original);
    const rate = getTaxRate();
    const result = String(Math.round(withTax / (1 + rate / 100) * 100) / 100);
    setDisplay(result);
    pushHistory(`${original} 税抜(${rate}%)`, result);
}));

btnDivmod.addEventListener("click", () => runWithErrorFallback(original => {
    const slashIndex = original.lastIndexOf("/");
    if (slashIndex === -1) throw new Error("No divisor");
    const left = original.slice(0, slashIndex);
    const right = original.slice(slashIndex + 1);
    const a = evaluateNumber(left);
    const b = evaluateNumber(right);
    if (b === 0) throw new Error("Division by zero");
    const quotient = Math.trunc(a / b);
    const remainder = a - quotient * b;
    const result = `${quotient} 余り ${remainder}`;
    setDisplay(result);
    pushHistory(original, result);
}));
