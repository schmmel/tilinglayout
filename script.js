let layout = {
    root: document.getElementById('layoutContainer'),
    direction: 'horizontal',
    width: 0,
    height: 0,
    borderSize: 4, // additional to css border
    defaultContainerSize: 1,
    latestCreatedWindow: '',
    tempI: 0,
}

const containerConfig = ['c0', 'c00', 'c01'];
const windowConfig = {
    'w00': '\n<a href="#" onclick="createWindow(layout.latestCreatedWindow, 1, \'created window \' + layout.tempI)">create window</a>',
    'w01': 'this is the window content',
};
const windowTitles = {
    'w00': 'TESTING WINDOW',
    'w01': 'BIG WINDOW',
}

let containers = [];

let containerSizes = {
    'c00': (1 / 3) * layout.defaultContainerSize,
    'c01': (2 / 3) * layout.defaultContainerSize,
}

loadContainerConfig(containerConfig);
loadWindowConfig(windowConfig);
clientParameters();

// for testing only
// layout.root.addEventListener('mousedown', (e) => {
//     if (e.button == 0) {
//         createWindow(e.target.id, 0, 'new window');
//     } else if (e.button == 2) {
//         destroyWindow(e.target.id);
//     }
// });
// window.addEventListener('contextmenu', (e) => {
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
    const primary = [...document.getElementsByClassName('primaryOrientation')];
    const secondary = [...document.getElementsByClassName('secondaryOrientation')];

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
        element.classList.remove('secondaryOrientation');
        element.classList.add('primaryOrientation');
    } else {
        element.classList.remove('primaryOrientation');
        element.classList.add('secondaryOrientation');
    }
}

function loadContainerConfig(containerConfig) {
    containerConfig.forEach(container => {

        const element = document.createElement('div');
        element.id = container;
        element.className = 'container';

        setContainerClass(element);

        if (containerSizes[container] == undefined) {
            // containerSizes[container] = containerSizes[container.slice(0, -1)];
            containerSizes[container] = layout.defaultContainerSize
        }

        if (container == 'c0') {
            layout.root.appendChild(element);
            return;
        }

        document.getElementById(container.slice(0, -1)).appendChild(element);
    })

    populateContainersArray();
}

function loadWindowConfig(windowConfig) {
    Object.keys(windowConfig).forEach(windowId => {
        const element = document.createElement('div');
        element.id = windowId;
        element.className = 'window';

        createComponent(element, 'header', windowTitles[windowId]);
        createComponent(element, 'content', windowConfig[windowId]);

        document.getElementById('c' + windowId.slice(1)).appendChild(element);
    })
}

function createWindow(targetId, newWindowLocation, content) {
    layout.tempI++

    if (targetId === '') {
        targetId = 'w' + containers[containers.length - 1].slice(1);
    }

    const target = document.getElementById(targetId);
    const parentContainer = 'c' + target.id.slice(1);

    // create 2 new containers
    for (let i = 0; i < 2; i++) {
        const element = document.createElement('div');
        element.id = parentContainer + i.toString();
        element.className = 'container';

        if (containerSizes[element.id] == undefined) {
            containerSizes[element.id] = layout.defaultContainerSize;
        }

        setContainerClass(element);

        document.getElementById(parentContainer).appendChild(element);
    }

    // create new window and append to specified container
    const element = document.createElement('div');
    element.id = 'w' + parentContainer.slice(1) + newWindowLocation.toString();
    element.className = 'window';

    createComponent(element, 'header', content);
    createComponent(element, 'content', content);

    document.getElementById('c' + element.id.slice(1)).appendChild(element);
    layout.latestCreatedWindow = element.id;

    // append original window to opposite container
    const oldWindowLocation = newWindowLocation ? 0 : 1;

    document.getElementById(parentContainer + oldWindowLocation.toString()).appendChild(target);
    target.id = 'w' + parentContainer.slice(1) + oldWindowLocation.toString();

    setContainerFlexDirection();
    setContainerSize();
}

function destroyWindow(targetId) {
    // dont destroy window if its the only window
    if (targetId == 'w0') {
        return;
    }

    if (targetId === layout.latestCreatedWindow) {
        layout.latestCreatedWindow = '';
    }

    const target = document.getElementById(targetId);
    const targetContainerId = 'c' + targetId.slice(1);

    delete containerSizes[targetContainerId];

    const affectedContainer = target.parentElement.parentElement;

    target.parentElement.remove();

    reformatWindows(affectedContainer);
}

function reformatWindows(target) {
    const elements = [...target.getElementsByTagName('*')];
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
                document.getElementById(element.id.slice(0, -2)).appendChild(document.getElementById(element.id.slice(0, -2) + '1'));
            }

            target.remove();
        };

        if (element.classList.contains('window')) {
            // element.id = element.id.slice(0, -1);

            element.id = element.id.slice(0, nthDigitToRemove) + element.id.slice(nthDigitToRemove + 1);

            if (originalId === layout.latestCreatedWindow) {
                layout.latestCreatedWindow = element.id;
            }

        } else if (element.classList.contains('container')) {
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

window.addEventListener('mousemove', mouseListener);

let resizeDirection;
let resizeTarget0;
let resizeTarget1;
let resizeTarget0Width;
let resizeTarget1Width;
let resizeTarget0Height;
let resizeTarget1Height;
let mouseX;
let mouseY;

let resizing = 0;

function mouseListener(e) {
    if (resizing == 1) {
        return;
    }

    if (e.target === document || !e.target?.classList.contains('window')) {
        layout.root.style.cursor = "default";
        document.removeEventListener('mousedown', resizableListener);
        return;
    }

    if (e.offsetX < layout.borderSize) {
        resizeDirection = 'left';
    } else if (e.offsetX > e.target.clientWidth - layout.borderSize) {
        resizeDirection = 'right';
    } else if (e.offsetY < layout.borderSize) {
        resizeDirection = 'top';
    } else if (e.offsetY > e.target.clientHeight - layout.borderSize) {
        resizeDirection = 'bottom';
    } else {
        layout.root.style.cursor = "default";
        document.removeEventListener('mousedown', resizableListener);
        return;
    }

    if ( // check whether mouse is on edge of screen
        e.clientX < 0 + (layout.borderSize + 8) ||              // left
        e.clientX > layout.width - (layout.borderSize + 8) ||   // right
        e.clientY < 0 + (layout.borderSize + 8) ||              // top
        e.clientY > layout.height - (layout.borderSize + 8)     // bottom
    ) {
        layout.root.style.cursor = "default";
        document.removeEventListener('mousedown', resizableListener);
        return;
    }

    if (resizeDirection == 'left' || resizeDirection == 'right') {
        layout.root.style.cursor = "ew-resize";
    } else {
        layout.root.style.cursor = "ns-resize";
    }

    document.addEventListener('mousedown', resizableListener);
}

function resizableListener(e) {
    let primaryTarget = e.target;
    let secondaryTarget;
    switch (resizeDirection) {
        case 'left':
            secondaryTarget = document.elementFromPoint(primaryTarget.offsetLeft - 1, primaryTarget.offsetTop + 1);
            break;
        case 'right':
            secondaryTarget = document.elementFromPoint(primaryTarget.offsetLeft + primaryTarget.offsetWidth + 1, primaryTarget.offsetTop + 1);
            break;
        case 'top':
            secondaryTarget = document.elementFromPoint(primaryTarget.offsetLeft + 1, primaryTarget.offsetTop - 1);
            break;
        case 'bottom':
            secondaryTarget = document.elementFromPoint(primaryTarget.offsetLeft + 1, primaryTarget.offsetTop + primaryTarget.offsetHeight + 1);
            break;
    }

    let resizeParent;
    for (let i = 0; i < Math.min(primaryTarget.id.length, secondaryTarget.id.length); i++) {
        if (primaryTarget.id[i] !== secondaryTarget.id[i]) {
            resizeParent = 'c' + primaryTarget.id.slice(1, i - primaryTarget.id.length);
            break;
        }
    }

    mouseX = e.x;
    mouseY = e.y;

    resizeTarget0 = document.getElementById(resizeParent + '0');
    resizeTarget1 = document.getElementById(resizeParent + '1');

    resizeTarget0Width = Number(window.getComputedStyle(resizeTarget0).getPropertyValue('width').slice(0, -2));
    resizeTarget1Width = Number(window.getComputedStyle(resizeTarget1).getPropertyValue('width').slice(0, -2));

    resizeTarget0Height = Number(window.getComputedStyle(resizeTarget0).getPropertyValue('height').slice(0, -2));
    resizeTarget1Height = Number(window.getComputedStyle(resizeTarget1).getPropertyValue('height').slice(0, -2));

    document.addEventListener('mousemove', resizeWindow);
}

function disableSelect(e) {
    e.preventDefault();
}

function resizeWindow(e) {
    document.removeEventListener('mousedown', resizableListener);
    document.addEventListener('selectstart', disableSelect);

    resizing = 1;

    let dx = e.x - mouseX;
    let dy = e.y - mouseY;

    switch (resizeDirection) {
        case 'left':
        case 'right':
            let totalWidth = resizeTarget0Width + resizeTarget1Width;

            let resizeTarget0NewWidth = (resizeTarget0Width + dx) / totalWidth;
            let resizeTarget1NewWidth = (resizeTarget1Width - dx) / totalWidth;

            resizeTarget0.style.width = Math.min(Math.max(10, resizeTarget0NewWidth * 100), 90) + '%';
            resizeTarget1.style.width = Math.min(Math.max(10, resizeTarget1NewWidth * 100), 90) + '%';

            containerSizes[resizeTarget0.id] = resizeTarget0NewWidth * layout.defaultContainerSize;
            containerSizes[resizeTarget1.id] = resizeTarget1NewWidth * layout.defaultContainerSize;
            break;
        case 'top':
        case 'bottom':
            let totalHeight = resizeTarget0Height + resizeTarget1Height;

            let resizeTarget0NewHeight = (resizeTarget0Height + dy) / totalHeight;
            let resizeTarget1NewHeight = (resizeTarget1Height - dy) / totalHeight;

            resizeTarget0.style.height = Math.min(Math.max(10, resizeTarget0NewHeight * 100), 90) + '%';
            resizeTarget1.style.height = Math.min(Math.max(10, resizeTarget1NewHeight * 100), 90) + '%';

            containerSizes[resizeTarget0.id] = resizeTarget0NewHeight * layout.defaultContainerSize;
            containerSizes[resizeTarget1.id] = resizeTarget1NewHeight * layout.defaultContainerSize;

            break;
    }
}

document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', resizeWindow);
    document.removeEventListener('selectstart', disableSelect)

    resizing = 0;
});

function setContainerSize() {
    Object.keys(containerSizes).forEach(key => {
        const targetContainer = document.getElementById(key);

        // container 0 has no siblings
        if (key == 'c0') {
            targetContainer.style.height = '100%';
            targetContainer.style.width = '100%';
            return;
        }

        const containerSize = containerSizes[key];
        const parentContainer = key.slice(0, -1);

        // hacky fix for some containers not having corresponding sizes???
        // i dont know why they dont have corresponding sizes but they should
        if (containerSizes[parentContainer + '0'] == undefined) {
            containerSizes[parentContainer + '0'] = layout.defaultContainerSize;
        }
        if (containerSizes[parentContainer + '1'] == undefined) {
            containerSizes[parentContainer + '1'] = layout.defaultContainerSize;
        }

        const totalSize = containerSizes[parentContainer + '0'] + containerSizes[parentContainer + '1'];

        if (targetContainer.style.flexDirection == 'row') {
            targetContainer.style.height = Math.min(Math.max(10, (containerSize / totalSize) * 100), 90) + '%';
            targetContainer.style.width = '100%';
        } else if (targetContainer.style.flexDirection == 'column') {
            targetContainer.style.height = '100%';
            targetContainer.style.width = Math.min(Math.max(10, (containerSize / totalSize) * 100), 90) + '%';
        }
    })
}

function populateContainersArray() {
    containers = [];

    const existingContainers = [...document.getElementsByClassName('container')];

    existingContainers.forEach(container => {
        containers.push(container.id)
    });
}

function createComponent(target, componentType, content) {
    let component = null;

    switch (componentType) {
        case 'header':
            component = document.createElement('div');
            component.className = 'header';
            target.appendChild(component);
            createComponent(component, 'title', content)
            createComponent(component, 'close-button');
            break;
        case 'title':
            component = document.createElement('span');
            component.className = 'title';
            component.innerText = content.toUpperCase();
            target.appendChild(component);
            break;
        case 'close-button':
            component = document.createElement('button');
            component.type = 'button';
            component.className = 'close-button';
            component.textContent = 'X';
            component.setAttribute('onclick', 'destroyWindow(this.parentElement.parentElement.id)');
            target.appendChild(component);
            break;
        case 'content':
            component = document.createElement('div');
            component.className = 'content';
            component.innerHTML = content;
            target.appendChild(component);
            break;
    }

}
