let layout = {
    root: document.getElementById('layoutContainer'),
    width: 0,
    height: 0,
}

let containers = ["0", "00", "01", "010", "011", "0110", "0111"];
let windows = {
    "00": "this is a window",
    "010": "this is also a winodw but wider",
    "0110": "this is also a window",
    "0111": "this window is very tiny",
};

let containerSizes = {
    "00": 5,
    "0111": 2,
}

loadContainerConfig(containers);
loadWindowConfig(windows);
clientParameters();

window.addEventListener('resize', () => {
    clientParameters();
});

layout.root.addEventListener('mousedown', (e) => {
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
    layout.width = layout.root.clientWidth;
    layout.height = layout.root.clientHeight;

    setContainerFlexDirection();
}

function setContainerFlexDirection() {
    const primary = [...document.getElementsByClassName("primaryOrientation")];
    const secondary = [...document.getElementsByClassName("secondaryOrientation")];

    primary.forEach(element => {
        element.style.flexDirection = layout.width >= layout.height ? "row" : "column";
    });

    secondary.forEach(element => {
        element.style.flexDirection = layout.width >= layout.height ? "column" : "row";
    });

    setContainerSize();
}

function loadContainerConfig(containers) {
    containers.forEach(container => {
        const element = document.createElement("div");
        element.id = container;
        element.className = "container";

        setContainerClass(element);

        // FIX
        // container size should be same as parent
        if (containerSizes[container] == undefined) {
            containerSizes[container] = 10;
        }

        if (container == "0") {
            layout.root.appendChild(element);
            return;
        }

        document.getElementById(container.slice(0, -1)).appendChild(element);
    })
}

function loadWindowConfig(windows) {
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

        // FIX
        // container size should be same as parent
        if (containerSizes[element.id] == undefined) {
            containerSizes[element.id] = 10;
        }

        setContainerClass(element);

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

    setContainerFlexDirection();
    setContainerSize();
}

function destroyWindow(target) {
    // dont destroy window if its the only window
    if (target.id == "0w") {
        return;
    }

    const affectedContainer = target.parentElement.parentElement;

    delete containerSizes[target.id.slice(0, -1)];

    target.parentElement.remove();

    reformatWindows(affectedContainer);
}

// FIX
// why do containers swap around sometimes

function reformatWindows(target) {
    const elements = [...target.getElementsByTagName("*")];
    console.log(target.id)
    const nthDigitToRemove = target.id.length;
    console.log(nthDigitToRemove)

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]

        if (i == 0) {
            if (element.id.length <= 2) {
                document.getElementById(layout.root.id).appendChild(element);
            } else {
                document.getElementById(element.id.slice(0, -2)).appendChild(element);
            }

            target.remove();
        };

        if (element.classList.contains("window")) {
            // remove "w" denoting window
            element.id = element.id.slice(0, -1);

            element.id = element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1);

            // append "w" denoting window
            element.id += "w";
        } else if (element.classList.contains("container")) {
            containerSizes[element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1)] = containerSizes[element.id];
            delete containerSizes[element.id];

            element.id = element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1);

            setContainerClass(element)
        }
    }

    setContainerFlexDirection();
    setContainerSize();
}

function setContainerClass(element) {
    // FIX
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    element.className = element.id.length % 2 ? "container primaryOrientation" : "container secondaryOrientation";
}

function setContainerSize() {
    Object.keys(containerSizes).forEach(key => {
        const targetContainer = document.getElementById(key);
        console.log(key);
        console.log(targetContainer);

        if (key == "0") {
            targetContainer.style.height = "100%";
            targetContainer.style.width = "100%";
            return;
        }

        const containerSize = containerSizes[key];
        const parentContainer = key.slice(0, -1);

        // hacky fix for some containers not having corresponding sizes???
        // i dont know why they dont have corresponding sizes but they should
        if (containerSizes[parentContainer + "0"] == undefined) {
            containerSizes[parentContainer + "0"] = 10;
        }
        if (containerSizes[parentContainer + "1"] == undefined) {
            containerSizes[parentContainer + "1"] = 10;
        }

        const totalSize = containerSizes[parentContainer + "0"] + containerSizes[parentContainer + "1"];

        if (targetContainer.classList.contains("primaryOrientation")) {
            targetContainer.style.height = ((containerSize / totalSize) * 100) + "%";
            targetContainer.style.width = "100%";
        } else if (targetContainer.classList.contains("secondaryOrientation")) {
            targetContainer.style.width = ((containerSize / totalSize) * 100) + "%";
            targetContainer.style.height = "100%";
        }
    })
}