let layout = {
    container: document.querySelector('#layoutContainer'),
    width: 0,
    height: 0,
    primaryOrientation: '',
    secondaryOrientation: '',
}

clientParameters();

createComponents(readJSON());

window.addEventListener('resize', () => {
    clientParameters();
    createComponents(readJSON());
});

function clientParameters() {
    layout.width = layout.container.clientWidth;
    layout.height = layout.container.clientHeight;

    layout.primaryOrientation = layout.width >= layout.height ? 'horizontal' : 'vertical';
    layout.secondaryOrientation = layout.width >= layout.height ? 'vertical' : 'horizontal';
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

function createComponents(components) {
    layout.container.innerHTML = "";

    components.forEach(componentObject => {
        const component = document.createElement("div");
        component.id = componentObject.id;
        component.className = componentObject.type;

        if (componentObject.id.length % 2) {
            component.className += " " + layout.primaryOrientation;
        } else {
            component.className += " " + layout.secondaryOrientation;
        }

        if (componentObject.type == "window") {
            component.innerHTML = componentObject.content;
        }

        if (componentObject.id == "0") {
            layout.container.appendChild(component);
            return;
        }
        
        document.getElementById(componentObject.id.slice(0, -1)).appendChild(component);
    });
}