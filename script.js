let layout = {
    root: document.getElementById('layoutContainer'),
    defaultContainerSize: 10,
    width: 0,
    height: 0,
}

let containers = ["0", "00", "01"];
let windows = {
    "00": "<h2>testing container</h2>\n<a href=\"#\" onclick=\"\">create window</a>",
    "01": "window",
};

let containerSizes = {
    // containers take size from parent unless specified, container 0 must be specified
    "0": layout.defaultContainerSize,
    "00": 5,
}

loadContainerConfig(containers);
loadWindowConfig(windows);
clientParameters();

window.addEventListener('resize', () => {
    clientParameters();
});

// for testing only
// layout.root.addEventListener('mousedown', (e) => {
//     if (e.button == 0) {
//         createWindow(e.target, 0, "new window");
//     } else if (e.button == 2) {
//         destroyWindow(e.target);
//     }
// });
// window.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
// });

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

        if (containerSizes[container] == undefined) {
            // containerSizes[container] = containerSizes[container.slice(0, -1)];
            containerSizes[container] = layout.defaultContainerSize
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

function createWindow(target, newWindowLocation, content) {
    const parentContainer = target.id.slice(0, -1);

    // create 2 new containers
    for (let i = 0; i < 2; i++) {
        const element = document.createElement("div");
        element.id = parentContainer + i.toString();
        element.className = "container";

        if (containerSizes[element.id] == undefined) {
            containerSizes[element.id] = containerSizes[parentContainer];
        }

        setContainerClass(element);

        document.getElementById(parentContainer).appendChild(element);
    }

    // create new window and append to specified container
    const element = document.createElement("div");
    element.id = parentContainer + newWindowLocation.toString() + "w"
    element.className = "window";

    element.innerHTML = content;

    document.getElementById(element.id.slice(0, -1)).appendChild(element);

    // append original window to opposite container
    const oldWindowLocation = newWindowLocation ? 0 : 1;

    document.getElementById(parentContainer + oldWindowLocation.toString()).appendChild(target);
    target.id = parentContainer + oldWindowLocation.toString() + "w";

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

function reformatWindows(target) {
    const elements = [...target.getElementsByTagName("*")];
    const nthDigitToRemove = target.id.length;

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]

        if (i == 0) {
            // only true if there is only 1 remaining window
            if (element.id.length <= 2) {
                layout.root.appendChild(element);
            } else {
                document.getElementById(element.id.slice(0, -2)).appendChild(element);
                document.getElementById(element.id.slice(0, -2)).appendChild(document.getElementById(element.id.slice(0, -2) + "1"));
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
    if (element.id.length % 2) {
        element.classList.remove("secondaryOrientation");
        element.classList.add("primaryOrientation");
    } else {
        element.classList.remove("primaryOrientation");
        element.classList.add("secondaryOrientation");
    }
}

function setContainerSize() {
    Object.keys(containerSizes).forEach(key => {
        const targetContainer = document.getElementById(key);

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
            containerSizes[parentContainer + "0"] = layout.defaultContainerSize;
        }
        if (containerSizes[parentContainer + "1"] == undefined) {
            containerSizes[parentContainer + "1"] = layout.defaultContainerSize;
        }

        const totalSize = containerSizes[parentContainer + "0"] + containerSizes[parentContainer + "1"];

        if (targetContainer.style.flexDirection == "row") {
            targetContainer.style.height = ((containerSize / totalSize) * 100) + "%";
            targetContainer.style.width = "100%";
        } else if (targetContainer.style.flexDirection == "column") {
            targetContainer.style.height = "100%";
            targetContainer.style.width = ((containerSize / totalSize) * 100) + "%";
        }
    })
}