let layout = {
    container: document.getElementById('layoutContainer'),
    width: 0,
    height: 0,
    primaryOrientation: '',
    secondaryOrientation: '',
}

let componentsa = [
    {
        type: "container",
        id: "0"
    },
    {
        type: "window",
        id: "00",
        content: "this is a window"
    },
    {
        type: "container",
        id: "01"
    },
    {
        type: "window",
        id: "010",
        content: "this is also a window but smaller"
    },
    {
        type: "container",
        id: "011"
    },
    {
        type: "window",
        id: "0110",
        content: "this is also a window but even smaller"
    },
    {
        type: "window",
        id: "0111",
        content: "this is also a window but even smaller 2"
    }
]

let components = {
    "0": {
        type: "container",
    },
    "00": {
        type: "window",
        content: "this is a window"
    },
    "01": {
        type: "container"
    },
    "010": {
        type: "window",
        content: "this is also a window but smaller"
    },
    "011": {
        type: "container"
    },
    "0110": {
        type: "window",
        content: "this is also a window but even smaller"
    },
    "0111": {
        type: "window",
        content: "this is also a window but even smaller 2"
    }
}

clientParameters();

createComponents(components);

window.addEventListener('resize', () => {
    clientParameters();
    createComponents(components);
});

layout.container.addEventListener('mousedown', (e) => {
    killComponent(e.target)
})

function clientParameters() {
    layout.width = layout.container.clientWidth;
    layout.height = layout.container.clientHeight;

    layout.primaryOrientation = layout.width >= layout.height ? 'horizontal' : 'vertical';
    layout.secondaryOrientation = layout.width >= layout.height ? 'vertical' : 'horizontal';
}

function createComponents(components) {
    layout.container.innerHTML = "";

    Object.keys(components).forEach(key => {
        const component = document.createElement("div");
        component.id = key;
        component.className = components[key].type;

        if (key.length % 2) {
            component.className += " " + layout.primaryOrientation;
        } else {
            component.className += " " + layout.secondaryOrientation;
        }

        if (components[key].type == "window") {
            component.innerHTML = components[key].content;
        }

        if (key == "0") {
            layout.container.appendChild(component);
            return;
        }

        document.getElementById(key.slice(0, -1)).appendChild(component);
    });
}

function killComponent(component) {
    console.log(component.id)

    // if (component.id % 2) {
    //     components[component.id.slice(0, -1)] = components[component.id.slice(0, -1) + "0"];
    //     delete components[component.id.slice(0, -1) + "0"];
    // } else {
    //     components[component.id.slice(0, -1)] = components[component.id.slice(0, -1) + "1"];
    //     delete components[component.id.slice(0, -1) + "1"];
    // }

    // console.log(components)

    // delete components[component.id];

    createComponents(components);
}