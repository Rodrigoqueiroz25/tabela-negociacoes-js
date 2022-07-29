export class Negociacao {

    constructor(data,quantidade,valor){
        this._data = new Date(data.getTime());
        this._quantidade = quantidade;
        this._valor = valor;
        Object.freeze(this);
    }

    get volume(){
        return this._quantidade * this._valor;
    }

    get quantidade(){
        return this._quantidade;
    }

    get data(){
        return new Date(this._data);
    }

    get valor(){
        return this._valor;
    }

    isEquals(outraNegociacao) {        
        return JSON.stringify(this) == JSON.stringify(outraNegociacao);
    }

}

