export class DateHelper {

    constructor(){
        throw new Error("Esta classe não pode ser instanciada.");
    }

    static textoToData(texto){
        if(!/\d{4}-\d{2}-\d{2}/.test(texto)){
            throw new Error("Data deve estar no formato: aaaa-mm-dd");
        }
        return new Date(texto.split('-'));
    }

    static dataToTexto(data){
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }

}