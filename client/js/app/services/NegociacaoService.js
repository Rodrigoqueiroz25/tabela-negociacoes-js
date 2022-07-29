import { NegociacaoDao } from "../dao/NegociacaoDao.js";
import { Negociacao } from "../models/Negociacao.js";
import { ConnectionFactory } from "./ConnectionFactory.js";
import { HttpService } from "./HttpService.js";


export class NegociacaoService {

    constructor(){
        this._httpService = new HttpService();
    }

    cadastra(negociacao){
       return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection).adiciona(negociacao))
            .then(() => 'Negociacao adicionada com sucesso')
            .catch((erro) => {
                console.log(erro);
                throw new Error('Não foi possivel adicionar a negociacao')
            });
    }

    lista(){
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection).listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociacoes!");
            })
    }

    apaga(){
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection).apagaTodos())
            .then(() => 'Negociacões apagadas com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociacoes!");
            })
    }

    importa(listaAtual){
        return this._obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente => negociacao.isEquals(negociacaoExistente))
            ))
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar negociacoes para importar');
            })
    }

    _obterNegociacoes(){

        return Promise.all(
            [this._obterNegociacaoSemana(),
            this._obterNegociacaoSemanaAnterior(),
            this._obterNegociacaoSemanaRetrasada()]
        ).then(negociacoes => {
            return negociacoes.reduce((novoArray, array) => novoArray.concat(array), [])
        }).catch(erro => {
            throw new Error(erro);
        });
    }


    _obterNegociacaoSemana(){
        
        return this._httpService.get('negociacoes/semana')
                .then(negociacoes => {
                   return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                })
                .catch(erro => {
                    console.log(erro);
                    throw new Error('não foi possivel obter as negociacoes da semana!');
                });
        
    }

    _obterNegociacaoSemanaRetrasada(){
        
        return this._httpService.get('negociacoes/retrasada')
                .then(negociacoes => {
                    return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                })
                .catch(erro => {
                    console.log(erro);
                    throw new Error('não foi possivel obter as negociacoes da semana retrasada!');
                });
        
        
    }

    _obterNegociacaoSemanaAnterior(){   
        
        return this._httpService.get('negociacoes/anterior')
                .then(negociacoes => {
                    return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                })
                .catch(erro => {
                    console.log(erro);
                    throw new Error('não foi possivel obter as negociacoes da semana anterior!');
                });
        
    }

}