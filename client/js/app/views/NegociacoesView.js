import { View } from "./View.js";
import { DateHelper } from "../helpers/DateHelper.js";
import { currentInstance } from "../controllers/NegociacaoController.js";

export class NegociacoesView extends View{

    constructor(elemento){
        super(elemento);

        elemento.addEventListener('click', function(event) {
            if(event.target.nodeName == 'TH'){
                currentInstance().ordena(event.target.textContent.toLowerCase());
            }
        });

    }

    _template(modelo){
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                    </tr>
                </thead>
                
                <tbody>
                    ${modelo.negociacoes.map(n => `
                        <tr>
                            <td>${DateHelper.dataToTexto(n.data)}</td>
                            <td>${n.quantidade}</td>
                            <td>${n.valor}</td>
                            <td>${n.volume}</td>
                        </tr>
                    `)}
                </tbody>
                
                <tfoot>
                    <td colspan="3"></td>
                    <td>
                        ${modelo.volumeTotal}
                    </td>
                </tfoot>
            </table>
        `;
    }


}
