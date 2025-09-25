let layout = {
    container: document.getElementById('layoutContainer'),
    width: 0,
    height: 0,
}

let containers = ["0", "00", "01", "010", "011", "0110", "0111"];
let windows = {
    "00": "this is a window",
    "010": "this is also a winodw but smaller",
    "0110": "this is also a window but even smaller",
    "0111": "this is also a window but even smaller 2",
};

createContainers(containers);
createWindows(windows);
clientParameters();

window.addEventListener('resize', () => {
    clientParameters();
});

layout.container.addEventListener('mousedown', (e) => {
    killComponent(e.target)
})

function clientParameters() {
    layout.width = layout.container.clientWidth;
    layout.height = layout.container.clientHeight;

    const primary = document.getElementsByClassName("primaryOrientation");
    const secondary = document.getElementsByClassName("secondaryOrientation");
    if (layout.width >= layout.height) {
        for (let element of primary) {
            element.style.flexDirection = "row";
        }
        for (let element of secondary) {
            element.style.flexDirection = "column";
        }
    } else {
        for (let element of primary) {
            element.style.flexDirection = "column";
        }
        for (let element of secondary) {
            element.style.flexDirection = "row";
        }
    }
}

function createContainers(containers) {
    containers.forEach(container => {
        const element = document.createElement("div");
        element.id = container;
        element.className = "container";

        if (container.length % 2) {
            element.className += " primaryOrientation";
        } else {
            element.className += " secondaryOrientation";
        }

        if (container == "0") {
            layout.container.appendChild(element);
            return;
        }

        document.getElementById(container.slice(0, -1)).appendChild(element);
    })
}

function createWindows(windows) {
    Object.keys(windows).forEach(key => {
        const element = document.createElement("div");
        element.id = key + "w";
        element.className = "window";

        element.innerHTML = windows[key];

        document.getElementById(key).appendChild(element);
    })
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

    // createComponents(components);
}