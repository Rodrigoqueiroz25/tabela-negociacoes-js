import { Bind } from "../helpers/Bind.js";
import { DateHelper } from "../helpers/DateHelper.js";
import { ListaNegociacoes } from "../models/ListaNegociacoes.js";
import { Mensagem } from "../models/Mensagem.js";
import { Negociacao } from "../models/Negociacao.js";
import { NegociacaoService } from "../services/NegociacaoService.js";
import { MensagemView } from "../views/MensagemView.js";
import { NegociacoesView } from "../views/NegociacoesView.js";

class NegociacaoController {

    constructor(){

        this._inputData = document.querySelector('#data');
        this._inputQuant = document.querySelector('#quantidade');
        this._inputValor = document.querySelector('#valor');
        
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView(document.querySelector('#negociacoesView')),
            'adiciona',
            'esvazia',
            'ordena',
            'inverteOrdem'
        );
    
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView(document.querySelector('#mensagemView')),
            'texto'
        );
    
        this._ordemAtual = '';
        this._service = new NegociacaoService();

        this._init();   

    }

    _init(){
        this._service.lista()
            .then(negociacoes => 
                negociacoes.forEach(negociacao => 
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => {
                this._mensagem.texto = erro;
            })

        setInterval(() => {
            this._importaNegociacoes();
        }, 3000);
    }

    adiciona(event){
        event.preventDefault();
        const negociacao = this._criaNegociacao();
        this._service.cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    apaga(){
        this._service.apaga()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);    
        }
        this._ordemAtual = coluna;
    }
    

    _importaNegociacoes(){
       this._service.importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociacoes importadas com sucesso';
            }))
            .catch(erro => this._mensagem.texto = erro);
    }


    _criaNegociacao(){
        return new Negociacao(
            DateHelper.textoToData(this._inputData.value),
            parseInt(this._inputQuant.value),
            parseFloat(this._inputValor.value)
        );
    }


    _limpaFormulario(){
        this._inputData.value = '';
        this._inputQuant.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

}

let negociacaoController = new NegociacaoController();

export function currentInstance() {

    return negociacaoController;

}