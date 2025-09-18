let layoutConfig = {
    layoutContainer: {
        type: 'container',
        content: [
            {
                type: 'window',
                content: 'this is a window',
            },
            {
                type: 'container',
                content: [
                    {
                        type: 'window',
                        content: 'this is also a window but smaller',
                    },
                    {
                        type: 'window',
                        content: 'this is also a window but smaller 2',
                    }
                ]
            }
        ]
    }
}

let layout = {
    container: document.querySelector('#layoutContainer'),
    width: 0,
    height: 0,
    orientation: '',
}

clientParameters();



window.addEventListener('resize', () => {
    clientParameters();
});

function clientParameters() {
    layout.width = layout.container.clientWidth;
    layout.height = layout.container.clientHeight;

    layout.orientation = layout.width >= layout.height ? 'horizontal' : 'vertical';
}

function loadWindows() {
    const stack = [layoutConfig];
    while (stack.length > 0) {
        const currentObject = stack.pop();
        Object.keys(currentObject).forEach(key => {
            if (typeof currentObject[key] === 'object') {
                if (Object.prototype.toString.apply(currentObject[key]) === '[object Object]') {
                    console.log(currentObject[key]);
                }
                stack.push(currentObject[key]);
            }
        });
    }
}

loadWindows();