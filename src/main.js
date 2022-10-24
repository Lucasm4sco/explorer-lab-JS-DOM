import "./css/index.css";
import Imask from 'imask';

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:first-child path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:last-child path');
const ccLogo = document.querySelector('.cc-logo span:last-child img');

function setCardType(type = 'default'){
    const colors = {
        visa: ['#436D99', '#2D57F2'],
        mastercard: ['#DF6F29', '#C69347'],
        default: ['black', 'gray']
    };

    ccBgColor01.setAttribute('fill', colors[type][0]);
    ccBgColor02.setAttribute('fill', colors[type][1]);
    ccLogo.setAttribute('src', `./cc-${type}.svg`);
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodePattern = Imask.createMask({
    mask: '000'
});

Imask(securityCode, securityCodePattern);


const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = Imask.createMask({
    mask: 'MM{/}YY',
    blocks: {
        MM: {
            mask: Imask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: Imask.MaskedRange,
            from: new String(new Date().getFullYear()).slice(2),
            to: new String(new Date().getFullYear()+10).slice(2)
        }
    }
});

IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = Imask.createMask({
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardType: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'default'
        }
    ],
    dispatch: function(appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/, '');
        const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex));
        setCardType(foundMask.cardType);
        return foundMask;
    }
});

Imask(cardNumber, cardNumberPattern);

document.querySelector('form').onsubmit = function(e){
    e.preventDefault();
}

const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', () => {
    document.querySelector('form').onsubmit();
});

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', () => {
    document.querySelector('.cc-holder .value').innerText = cardHolder.value;
});

cardNumber.addEventListener('input', () => {
    document.querySelector('.cc-number').innerText = cardNumber.value;
});

expirationDate.addEventListener('input', () => {
    document.querySelector('.cc-expiration .value').innerText = expirationDate.value;
})

securityCode.addEventListener('input', () => {
    document.querySelector('.cc-security .value').innerText = securityCode.value;
})