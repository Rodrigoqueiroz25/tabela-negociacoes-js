export class View {

    constructor(elemento){
        this._elemento = elemento;
    }

    _template(modelo){
        throw new Error("O método template deve ser implementado");
    }


    update(modelo){
        this._elemento.innerHTML = this._template(modelo);
    }

}