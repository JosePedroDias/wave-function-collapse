const options = [
    {
        label: 'sprite scale',
        name: 'scale',
        options: {
            '1': '1',
            '2': '2',
            '3': '3'
        }
    },
    {
        label: 'step mode',
        name: 'stepMode',
        options: {
            '500 ms between steps': '500msPerStep',
            'render at 10 fps': '10fps',
            'render at end only': 'onlyEnd',
        }
    },
];

export function ui() {
    const u = new URL(location.href);
    const searchParams = u.searchParams;

    const values = {};

    const uiEl = document.createElement('div');
    uiEl.className = 'ui';

    options.forEach((opt) => {
        const divEl = document.createElement('div');
        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', opt.name);
        labelEl.appendChild( document.createTextNode(opt.label) );
        divEl.appendChild(labelEl);

        const selectEl = document.createElement('select');
        selectEl.id = opt.name;

        let currentValue = searchParams.get(opt.name);

        for (const [k, v] of Object.entries(opt.options)) {
            const optionEl = document.createElement('option');
            optionEl.appendChild( document.createTextNode(k) );
            optionEl.value = v;
            if (currentValue === null) currentValue = v;
            if (v === currentValue) optionEl.selected = true;
            selectEl.appendChild(optionEl);
        }

        values[opt.name] = currentValue;

        selectEl.addEventListener('change', () => {
            const newValue = selectEl.value;
            searchParams.set(opt.name, newValue);
            location.search = searchParams.toString();
        });
        divEl.appendChild(selectEl);
        uiEl.appendChild(divEl);
    });

    document.body.appendChild(uiEl);

    return values;
}
