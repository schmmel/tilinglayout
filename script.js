let layoutConfig = {
    layoutContainer: {
        type: 'container',
        id: '0',
        content: [
            {
                type: 'window',
                id: '00',
                content: 'this is a window',
            },
            {
                type: 'container',
                id: '01',
                content: [
                    {
                        type: 'container',
                        id: '010',
                        content: [
                            {
                                type: 'window',
                                id: '0100',                                
                                content: 'this is also a window but smaller',
                            },
                            {
                                type: 'window',
                                id: '0101',                                
                                content: 'this is also a window but smaller 2',
                            }
                        ]
                    },
                    {
                        type: 'container',
                        id: '011',
                        content: [
                            {
                                type: 'window',
                                id: '0110',
                                content: 'this is also a window but smaller 3',
                            },
                            {
                                type: 'window',
                                id: '0111',
                                content: 'this is also a window but smaller 4',
                            }
                        ]
                    },

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