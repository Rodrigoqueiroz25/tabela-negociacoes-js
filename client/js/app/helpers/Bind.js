import { ProxyFactory } from "../services/ProxyFactory.js";

export class Bind {

    constructor(modelo, view, ...props){
        const proxy = ProxyFactory.create(
            modelo,
            props,
            model => view.update(model)
        );
        view.update(modelo);

        return proxy;
    }

}