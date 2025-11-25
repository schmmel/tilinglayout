let layout = {
    root: document.getElementById('layoutContainer'),
    direction: 'horizontal',
    width: 0,
    height: 0,
    borderSize: 4, // additional to css border
    defaultContainerSize: 1,
    latestCreatedWindow: "",
    tempI: 0,
}


const containerConfig = ["c0", "c00", "c01"];
const windowConfig = {
    "w00": "\n<a href=\"#\" onclick=\"createWindow(layout.latestCreatedWindow, 1, 'created window ' + layout.tempI)\">create window</a>",
    "w01": "this is the window content",
};
const windowTitles = {
    "w00": "TESTING WINDOW",
    "w01": "BIG WINDOW",
}

let containers = [];

let containerSizes = {
    "c00": (1 / 3) * layout.defaultContainerSize,
    "c01": (2 / 3) * layout.defaultContainerSize,
}

loadContainerConfig(containerConfig);
loadWindowConfig(windowConfig);
clientParameters();

// for testing only
// layout.root.addEventListener('mousedown', (e) => {
//     if (e.button == 0) {
//         createWindow(e.target.id, 0, "new window");
//     } else if (e.button == 2) {
//         destroyWindow(e.target.id);
//     }
// });
// window.addEventListener("contextmenu", (e) => {
//     e.preventDefault();
// });

window.addEventListener('resize', () => {
    clientParameters();
});

function clientParameters() {
    layout.width = layout.root.clientWidth;
    layout.height = layout.root.clientHeight;
    layout.direction = layout.width >= layout.height ? 'horizontal' : 'vertical';

    setContainerFlexDirection();
}

function setContainerFlexDirection() {
    const primary = [...document.getElementsByClassName("primaryOrientation")];
    const secondary = [...document.getElementsByClassName("secondaryOrientation")];

    primary.forEach(element => {
        element.style.flexDirection = layout.direction === 'horizontal' ? 'column' : 'row';
    });

    secondary.forEach(element => {
        element.style.flexDirection = layout.direction === 'horizontal' ? 'row' : 'column';
    });

    setContainerSize();
}

// element id is always 1 longer than parent element
function setContainerClass(element) {
    if (element.id.length % 2) {
        element.classList.remove("secondaryOrientation");
        element.classList.add("primaryOrientation");
    } else {
        element.classList.remove("primaryOrientation");
        element.classList.add("secondaryOrientation");
    }
}

function loadContainerConfig(containerConfig) {
    containerConfig.forEach(container => {

        const element = document.createElement("div");
        element.id = container;
        element.className = "container";

        setContainerClass(element);

        if (containerSizes[container] == undefined) {
            // containerSizes[container] = containerSizes[container.slice(0, -1)];
            containerSizes[container] = layout.defaultContainerSize
        }

        if (container == "c0") {
            layout.root.appendChild(element);
            return;
        }

        document.getElementById(container.slice(0, -1)).appendChild(element);
    })

    populateContainersArray();
}

function loadWindowConfig(windowConfig) {
    Object.keys(windowConfig).forEach(windowId => {
        const element = document.createElement("div");
        element.id = windowId;
        element.className = "window";

        createComponent(element, "header", windowTitles[windowId]);
        createComponent(element, "content", windowConfig[windowId]);

        document.getElementById('c' + windowId.slice(1)).appendChild(element);

        element.addEventListener("mousedown", resizeListener);
    })
}

function createWindow(targetId, newWindowLocation, content) {
    layout.tempI++

    if (targetId === "") {
        targetId = 'w' + containers[containers.length - 1].slice(1);
    }

    const target = document.getElementById(targetId);
    const parentContainer = 'c' + target.id.slice(1);

    // create 2 new containers
    for (let i = 0; i < 2; i++) {
        const element = document.createElement("div");
        element.id = parentContainer + i.toString();
        element.className = "container";

        if (containerSizes[element.id] == undefined) {
            containerSizes[element.id] = layout.defaultContainerSize;
        }

        setContainerClass(element);

        document.getElementById(parentContainer).appendChild(element);
    }

    // create new window and append to specified container
    const element = document.createElement("div");
    element.id = 'w' + parentContainer.slice(1) + newWindowLocation.toString();
    element.className = "window";

    createComponent(element, "header", content);
    createComponent(element, "content", content);

    document.getElementById('c' + element.id.slice(1)).appendChild(element);
    layout.latestCreatedWindow = element.id;

    element.addEventListener("mousedown", resizeListener);

    // append original window to opposite container
    const oldWindowLocation = newWindowLocation ? 0 : 1;

    document.getElementById(parentContainer + oldWindowLocation.toString()).appendChild(target);
    target.id = 'w' + parentContainer.slice(1) + oldWindowLocation.toString();

    setContainerFlexDirection();
    setContainerSize();
}

function destroyWindow(targetId) {
    // dont destroy window if its the only window
    if (targetId == "w0") {
        return;
    }

    if (targetId === layout.latestCreatedWindow) {
        layout.latestCreatedWindow = "";
    }

    const target = document.getElementById(targetId);
    const targetContainerId = 'c' + targetId.slice(1);

    delete containerSizes[targetContainerId];

    const affectedContainer = target.parentElement.parentElement;

    target.parentElement.remove();

    reformatWindows(affectedContainer);
}

function reformatWindows(target) {
    const elements = [...target.getElementsByTagName("*")];
    const nthDigitToRemove = target.id.length;

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        const originalId = element.id;

        if (i == 0) {
            // only true if there is only 1 remaining window
            if (element.id.length <= 3) {
                layout.root.appendChild(element);
            } else {
                document.getElementById(element.id.slice(0, -2)).appendChild(element);
                document.getElementById(element.id.slice(0, -2)).appendChild(document.getElementById(element.id.slice(0, -2) + "1"));
            }

            target.remove();
        };

        if (element.classList.contains("window")) {
            // element.id = element.id.slice(0, -1);

            element.id = element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1);

            if (originalId === layout.latestCreatedWindow) {
                layout.latestCreatedWindow = element.id;
            }

        } else if (element.classList.contains("container")) {
            containerSizes[element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1)] = containerSizes[element.id];
            delete containerSizes[element.id];

            element.id = element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1);

            setContainerClass(element)
        }
    }

    setContainerFlexDirection();
    setContainerSize();
    populateContainersArray();
}

let resizeTarget;
let resizeDirection;

function resizeListener(e) {
    if (!e.target.classList.contains("window")) {
        return;
    }

    if ( // check whether mousedown is on edge of screen
        e.clientX < 0 + (layout.borderSize + 8) ||              // left
        e.clientX > layout.width - (layout.borderSize + 8) ||   // right
        e.clientY < 0 + (layout.borderSize + 8) ||              // top
        e.clientY > layout.height - (layout.borderSize + 8)     // bottom
    ) {
        return;
    }

    if (e.offsetX < layout.borderSize) {
        resizeDirection = "left";
    } else if (e.offsetX > e.target.clientWidth - layout.borderSize) {
        resizeDirection = "right";
    } else if (e.offsetY < layout.borderSize) {
        resizeDirection = "top";
    } else if (e.offsetY > e.target.clientHeight - layout.borderSize) {
        resizeDirection = "bottom";
    } else {
        return;
    }

    resizeTarget = e.target;
    document.addEventListener("mousemove", resizeWindow);
}

function resizeWindow(e) {

    // detect window on opposite side of border
    let secondaryTarget;
    switch (resizeDirection) {
        case "left":
            secondaryTarget = document.elementFromPoint(resizeTarget.offsetLeft - 1, e.y);
            break;
        case "right":
            secondaryTarget = document.elementFromPoint(resizeTarget.offsetLeft + resizeTarget.offsetWidth + 1, e.y);
            break;
        case "top":
            secondaryTarget = document.elementFromPoint(e.x, resizeTarget.offsetTop - 1);
            break;
        case "bottom":
            secondaryTarget = document.elementFromPoint(e.x, resizeTarget.offsetTop + resizeTarget.offsetHeight + 1);
            break;
    }
}

document.addEventListener('mouseup', () => {
    document.removeEventListener("mousemove", resizeWindow);
});

function setContainerSize() {
    Object.keys(containerSizes).forEach(key => {
        const targetContainer = document.getElementById(key);

        // container 0 has no siblings
        if (key == "c0") {
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

function populateContainersArray() {
    containers = [];

    const existingContainers = [...document.getElementsByClassName("container")];

    existingContainers.forEach(container => {
        containers.push(container.id)
    });
}

function createComponent(target, componentType, content) {
    let component = null;

    switch (componentType) {
        case "header":
            component = document.createElement("div");
            component.className = "header";
            target.appendChild(component);
            createComponent(component, "title", content)
            createComponent(component, "close-button");
            break;
        case "title":
            component = document.createElement("span");
            component.className = "title";
            component.innerText = content.toUpperCase();
            target.appendChild(component);
            break;
        case "close-button":
            component = document.createElement("button");
            component.type = "button";
            component.className = "close-button";
            component.textContent = "X";
            component.setAttribute("onclick", "destroyWindow(this.parentElement.parentElement.id)");
            target.appendChild(component);
            break;
        case "content":
            component = document.createElement("div");
            component.className = "content";
            component.innerHTML = content;
            target.appendChild(component);
            break;
    }

}
