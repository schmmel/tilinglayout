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
    if (e.button == 0) {
        createWindow(e.target, "new window");
    } else if (e.button == 2) {
        destroyWindow(e.target);
    }
});

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

function clientParameters() {
    layout.width = layout.container.clientWidth;
    layout.height = layout.container.clientHeight;

    containerFlexDirection();
}

function containerFlexDirection() {
    const primary = [...document.getElementsByClassName("primaryOrientation")];
    const secondary = [...document.getElementsByClassName("secondaryOrientation")];

    primary.forEach(element => {
        element.style.flexDirection = layout.width >= layout.height ? "row" : "column";
    });

    secondary.forEach(element => {
        element.style.flexDirection = layout.width >= layout.height ? "column" : "row";
    });
}

function createContainers(containers) {
    containers.forEach(container => {
        const element = document.createElement("div");
        element.id = container;
        element.className = "container";

        containerClass(element);

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

function createWindow(target, content) {
    const parentContainer = target.id.slice(0, -1);

    // create 2 new containers
    for (let i = 0; i < 2; i++) {
        const element = document.createElement("div");
        element.id = parentContainer + i.toString();

        containerClass(element);

        document.getElementById(parentContainer).appendChild(element);
    }

    // append original window to new container 0
    document.getElementById(parentContainer + "0").appendChild(document.getElementById(target.id));
    document.getElementById(target.id).id = parentContainer + "0w";

    // create new window and append to new container 1
    const element = document.createElement("div");
    element.id = parentContainer + "1w"
    element.className = "window";

    element.innerHTML = content;

    document.getElementById(element.id.slice(0, -1)).appendChild(element);

    containerFlexDirection();
}

function destroyWindow(target) {
    // dont destroy window if its the only window
    if (target.id == "0w") {
        return;
    }

    const affectedContainer = target.parentElement.parentElement;

    target.parentElement.remove();

    reformatWindows(affectedContainer);
}

function reformatWindows(target) {
    let elements = [...target.getElementsByTagName("*")];

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]

        if (i == 0) {
            if (element.id.length <= 2) {
                document.getElementById(layout.container.id).appendChild(element);
            } else {
                document.getElementById(element.id.slice(0, -2)).appendChild(element);
            }

            target.remove();
        };

        if (element.className == "window") {
            element.id = element.id.slice(0, -2) + "w";
        } else {
            element.id = element.id.slice(0, -1);
            containerClass(element)
        }
    }

    containerFlexDirection();
}

function containerClass(element) {
    element.className = element.id.length % 2 ? "container primaryOrientation" : "container secondaryOrientation";

}