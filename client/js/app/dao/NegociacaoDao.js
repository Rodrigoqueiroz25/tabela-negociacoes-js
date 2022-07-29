import { Negociacao } from "../models/Negociacao.js";

export class NegociacaoDao {

    constructor(connection){
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao){
        return new Promise((resolve,reject) => {

            let request = this._connection
                .transaction([this._store],'readwrite')
                .objectStore(this._store)
                .add(negociacao);

                
            request.onsuccess = (e) =>{
                resolve();
            }

            request.onerror = (e) => {
                console.log(e.target.error);
                reject("negociação não incluida");
            }

        });
    }

    listaTodos(){
        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store],'readwrite')
                .objectStore('negociacoes')
                .openCursor();

            let negociacoes = [];
            
            cursor.onsuccess = (e) => {
                let ponteiro = e.target.result;

                if(ponteiro){
                    let dado = ponteiro.value;
                    negociacoes.push(new Negociacao(dado._data,dado._quantidade,dado._valor));
                    ponteiro.continue();
                }
                else {
                    resolve(negociacoes);
                }
            };

            cursor.onerror = (e) => {
                console.log(e.target.error.name);
                reject("Não foi possivel listar as negociacoes");
            };

        })
    }

    apagaTodos(){
        return new Promise((resolve, reject) => {

            let request = this._connection
                .transaction([this._store],'readwrite')
                .objectStore('negociacoes')
                .clear();
            
            request.onsuccess = (e) => resolve("negociacoes removidas com sucesso");

            request.onerror = (e) => {
                console.log(e.target.error);
                reject("negociacoes não foram removidas com sucesso");
            } 

        })   
    }



}