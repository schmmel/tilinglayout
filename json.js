let layoutConfig = {
    "layoutContainer": {
        "type": "container",
        "id": "0",
        "content": [
            {
                "type": "window",
                "id": "00",
                "content": "this is a window"
            },
            {
                "type": "container",
                "id": "01",
                "content": [
                    {
                        "type": "window",
                        "id": "010",
                        "content": "this is also a window but smaller"
                    },
                    {
                        "type": "container",
                        "id": "011",
                        "content": [
                            {
                                "type": "window",
                                "id": "0110",
                                "content": "this is also a window but even smaller"
                            },
                            {
                                "type": "window",
                                "id": "0111",
                                "content": "this is also a window but even smaller 2"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

function readJSON() {
    let components = [];

    const stack = [layoutConfig];
    while (stack.length > 0) {
        const currentObject = stack.pop();
        Object.keys(currentObject).forEach(key => {
            if (typeof currentObject[key] === 'object') {
                if (Object.prototype.toString.apply(currentObject[key]) === '[object Object]') {
                    components.push(currentObject[key]);
                }
                stack.push(currentObject[key]);
            }
        });
    }

    return components;
}

// kinda unneccesary if i turn it into an array anyway and also an array is easier to work with